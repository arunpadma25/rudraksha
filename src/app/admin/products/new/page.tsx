import { ProductForm } from "@/components/ProductForm";
import { createProduct } from "@/app/admin/actions";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-bold text-brand-900">Add Product</h1>
      <ProductForm action={createProduct} submitLabel="Create Product" />
    </div>
  );
}
