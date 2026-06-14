import Link from "next/link";
import { LogoMark } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-brand-100 bg-brand-900 text-brand-100">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <LogoMark className="h-9 w-9" />
            <span className="font-serif text-lg font-bold text-white">Rudraksha Sacred</span>
          </div>
          <p className="mt-3 text-sm text-brand-200">
            Pure organic, home-grown rudraksha from our own family farm near Mangalore, Karnataka.
            Hand-harvested and energised, with worldwide shipping and multi-currency checkout.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-white">Shop</h4>
          <ul className="mt-3 space-y-2 text-sm text-brand-200">
            <li><Link href="/products" className="hover:text-white">All Beads</Link></li>
            <li><Link href="/products?featured=1" className="hover:text-white">Featured</Link></li>
            <li><Link href="/products?sort=price-asc" className="hover:text-white">Budget Friendly</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-brand-200">
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/account" className="hover:text-white">My Orders</Link></li>
            <li><Link href="/cart" className="hover:text-white">Cart</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white">Trust &amp; Care</h4>
          <ul className="mt-3 space-y-2 text-sm text-brand-200">
            <li>Grown on our own organic farm</li>
            <li>100% chemical-free &amp; hand-harvested</li>
            <li>Energised &amp; ready to wear</li>
            <li>Secure multi-currency payments</li>
            <li>7-day easy returns</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-brand-800 py-4 text-center text-xs text-brand-300">
        © {new Date().getFullYear()} Rudraksha Sacred Store. For demonstration purposes. Spiritual
        benefits are based on traditional belief and are not medical claims.
      </div>
    </footer>
  );
}
