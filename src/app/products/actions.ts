"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export type ReviewState = { ok?: boolean; error?: string };

export async function createReview(
  productId: string,
  slug: string,
  _prev: ReviewState,
  formData: FormData
): Promise<ReviewState> {
  const user = await getSessionUser();
  if (!user) return { error: "Please log in to write a review." };

  const rating = Number.parseInt(String(formData.get("rating") ?? ""), 10);
  const comment = String(formData.get("comment") ?? "").trim();

  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return { error: "Please select a rating between 1 and 5 stars." };
  }
  if (comment.length < 3) {
    return { error: "Please write a short comment." };
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return { error: "Product not found." };

  await prisma.review.create({
    data: {
      productId,
      userId: user.id,
      authorName: user.name,
      rating,
      comment: comment.slice(0, 1000),
    },
  });

  const agg = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: true,
  });
  await prisma.product.update({
    where: { id: productId },
    data: { ratingAvg: agg._avg.rating ?? 0, ratingCount: agg._count },
  });

  revalidatePath(`/products/${slug}`);
  revalidatePath("/products");
  return { ok: true };
}
