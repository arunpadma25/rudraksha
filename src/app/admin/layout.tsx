import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";

export const metadata = { title: "Admin" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login?redirect=/admin");
  if (user.role !== "ADMIN") redirect("/");

  return (
    <div className="mx-auto max-w-7xl gap-6 px-4 py-8 md:flex">
      <aside className="mb-6 md:mb-0 md:w-56 md:shrink-0">
        <div className="rounded-2xl border border-brand-100 bg-white p-4">
          <div className="px-2 pb-3 font-serif text-lg font-bold text-brand-900">Admin Panel</div>
          <nav className="flex flex-col gap-1 text-sm">
            <Link href="/admin" className="rounded-lg px-3 py-2 font-medium text-brand-700 hover:bg-brand-50">Dashboard</Link>
            <Link href="/admin/products" className="rounded-lg px-3 py-2 font-medium text-brand-700 hover:bg-brand-50">Products</Link>
            <Link href="/admin/products/new" className="rounded-lg px-3 py-2 font-medium text-brand-700 hover:bg-brand-50">Add Product</Link>
            <Link href="/admin/orders" className="rounded-lg px-3 py-2 font-medium text-brand-700 hover:bg-brand-50">Orders</Link>
            <Link href="/" className="mt-2 rounded-lg px-3 py-2 font-medium text-brand-500 hover:bg-brand-50">← Back to store</Link>
          </nav>
        </div>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
