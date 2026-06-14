"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function num(value: FormDataEntryValue | null): number {
  const n = Number.parseInt(String(value ?? "").trim(), 10);
  return Number.isFinite(n) ? n : 0;
}

function optionalNum(value: FormDataEntryValue | null): number | null {
  const s = String(value ?? "").trim();
  if (!s) return null;
  const n = Number.parseInt(s, 10);
  return Number.isFinite(n) ? n : null;
}

function str(value: FormDataEntryValue | null): string {
  return String(value ?? "").trim();
}

function buildData(formData: FormData) {
  const name = str(formData.get("name"));
  const slugInput = str(formData.get("slug"));
  return {
    name,
    slug: slugInput ? slugify(slugInput) : slugify(name),
    mukhi: num(formData.get("mukhi")),
    origin: str(formData.get("origin")) || "Mangalore, Karnataka",
    shortDesc: str(formData.get("shortDesc")),
    description: str(formData.get("description")),
    benefits: str(formData.get("benefits")),
    rulingPlanet: str(formData.get("rulingPlanet")) || null,
    deity: str(formData.get("deity")) || null,
    mantra: str(formData.get("mantra")) || null,
    priceInr: num(formData.get("priceInr")),
    compareAtInr: optionalNum(formData.get("compareAtInr")),
    stock: num(formData.get("stock")),
    featured: formData.get("featured") === "on",
    active: formData.get("active") === "on",
  };
}

function parseImages(formData: FormData): { urls: string[]; defaultUrl: string | null } {
  let urls: string[] = [];
  try {
    const parsed = JSON.parse(str(formData.get("imagesJson")) || "[]");
    if (Array.isArray(parsed)) urls = parsed.filter((u): u is string => typeof u === "string");
  } catch {
    urls = [];
  }
  const requested = str(formData.get("defaultImage"));
  const defaultUrl = requested && urls.includes(requested) ? requested : urls[0] ?? null;
  return { urls, defaultUrl };
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const data = buildData(formData);
  if (!data.name || !data.slug || data.priceInr <= 0) {
    throw new Error("Name and a positive price are required");
  }
  const { urls, defaultUrl } = parseImages(formData);
  await prisma.product.create({
    data: {
      ...data,
      image: defaultUrl,
      images: { create: urls.map((url, position) => ({ url, position })) },
    },
  });
  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();
  const data = buildData(formData);
  const { urls, defaultUrl } = parseImages(formData);
  await prisma.$transaction([
    prisma.productImage.deleteMany({ where: { productId: id } }),
    prisma.product.update({
      where: { id },
      data: {
        ...data,
        image: defaultUrl,
        images: { create: urls.map((url, position) => ({ url, position })) },
      },
    }),
  ]);
  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath(`/products/${data.slug}`);
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function setOrderStatus(id: string, formData: FormData) {
  await requireAdmin();
  const status = String(formData.get("status") ?? "");
  const allowed = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];
  if (!allowed.includes(status)) throw new Error("Invalid status");
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}
