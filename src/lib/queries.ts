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
  mukhi?: number;
  minPriceInr?: number;
  maxPriceInr?: number;
  sort?: "newest" | "price-asc" | "price-desc" | "mukhi-asc";
};

export async function getProducts(filters: ProductFilters = {}) {
  const where: Prisma.ProductWhereInput = { active: true };

  if (filters.featured) where.featured = true;
  if (filters.origin) where.origin = filters.origin;
  if (typeof filters.mukhi === "number") where.mukhi = filters.mukhi;

  if (typeof filters.minPriceInr === "number" || typeof filters.maxPriceInr === "number") {
    where.priceInr = {
      ...(typeof filters.minPriceInr === "number" ? { gte: filters.minPriceInr } : {}),
      ...(typeof filters.maxPriceInr === "number" ? { lte: filters.maxPriceInr } : {}),
    };
  }

  if (filters.search) {
    // Case-insensitive so "nepal" matches "Nepal" etc. (Postgres `contains` is
    // case-sensitive by default).
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { shortDesc: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (filters.sort === "price-asc") orderBy = { priceInr: "asc" };
  else if (filters.sort === "price-desc") orderBy = { priceInr: "desc" };
  else if (filters.sort === "mukhi-asc") orderBy = { mukhi: "asc" };

  return prisma.product.findMany({ where, orderBy, select: productCardSelect });
}

// Distinct mukhi (face-count) values across active products, for the shop filter.
export async function getMukhiOptions(): Promise<number[]> {
  const rows = await prisma.product.findMany({
    where: { active: true },
    distinct: ["mukhi"],
    select: { mukhi: true },
    orderBy: { mukhi: "asc" },
  });
  return rows.map((r) => r.mukhi);
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
