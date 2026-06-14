import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/ProductForm";
import { updateProduct } from "@/app/admin/actions";

type Params = Promise<{ id: string }>;

export default async function EditProductPage({ params }: { params: Params }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { position: "asc" } } },
  });
  if (!product) notFound();

  const action = updateProduct.bind(null, id);

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-bold text-brand-900">Edit Product</h1>
      <ProductForm
        action={action}
        product={{ ...product, images: product.images.map((img) => img.url) }}
        submitLabel="Save Changes"
      />
    </div>
  );
}
