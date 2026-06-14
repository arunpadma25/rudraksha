import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const productCardSelect = {
  id: true,
  slug: true,
  name: true,
  mukhi: true,
  origin: true,
  shortDesc: true,
  priceInr: true,
  compareAtInr: true,
  stock: true,
  image: true,
  featured: true,
  ratingAvg: true,
  ratingCount: true,
} satisfies Prisma.ProductSelect;

export type ProductFilters = {
  search?: string;
  origin?: string;
  featured?: boolean;
  sort?: "newest" | "price-asc" | "price-desc" | "mukhi-asc";
};

export async function getProducts(filters: ProductFilters = {}) {
  const where: Prisma.ProductWhereInput = { active: true };

  if (filters.featured) where.featured = true;
  if (filters.origin) where.origin = filters.origin;
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search } },
      { shortDesc: { contains: filters.search } },
      { description: { contains: filters.search } },
    ];
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (filters.sort === "price-asc") orderBy = { priceInr: "asc" };
  else if (filters.sort === "price-desc") orderBy = { priceInr: "desc" };
  else if (filters.sort === "mukhi-asc") orderBy = { mukhi: "asc" };

  return prisma.product.findMany({ where, orderBy, select: productCardSelect });
}

export async function getFeaturedProducts(limit = 4) {
  return prisma.product.findMany({
    where: { active: true, featured: true },
    take: limit,
    select: productCardSelect,
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { images: { orderBy: { position: "asc" } } },
  });
}

export async function getRelatedProducts(slug: string, limit = 4) {
  return prisma.product.findMany({
    where: { active: true, slug: { not: slug } },
    take: limit,
    orderBy: { featured: "desc" },
    select: productCardSelect,
  });
}

export function getOrigins(): string[] {
  return ["Mangalore, Karnataka", "Karnataka", "India"];
}

export async function getUserAddresses(userId: string) {
  return prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { id: "desc" }],
  });
}

export async function getReviews(productId: string, limit = 20) {
  return prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
