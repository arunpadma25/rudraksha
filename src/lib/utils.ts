export type ProductImageInput = {
  image?: string | null;
  mukhi: number;
  name: string;
};

export function productImageUrl(p: ProductImageInput): string {
  if (p.image && p.image.trim().length > 0) return p.image;
  const params = new URLSearchParams({
    mukhi: String(p.mukhi),
    label: p.name,
  });
  return `/api/product-image?${params.toString()}`;
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function orderStatusColor(status: string): string {
  switch (status) {
    case "PAID":
      return "bg-emerald-100 text-emerald-800";
    case "SHIPPED":
      return "bg-blue-100 text-blue-800";
    case "DELIVERED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-amber-100 text-amber-800";
  }
}
