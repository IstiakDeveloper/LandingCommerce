import { requireSeller } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ProductForm } from "@/components/app/ProductForm";
import { notFound, redirect } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireSeller();
  if (!user?.shop) redirect("/login");
  const { id } = await params;
  const p = await prisma.product.findFirst({ where: { id, shopId: user.shop.id } });
  if (!p) notFound();
  return (
    <ProductForm
      initial={{
        id: p.id,
        title: p.title,
        pricePoisha: p.pricePoisha,
        compareAtPoisha: p.compareAtPoisha,
        photos: JSON.parse(p.photos || "[]"),
        stock: p.stock,
        badge: p.badge,
        variants: JSON.parse(p.variants || "[]"),
        hideWhenZero: p.hideWhenZero,
      }}
    />
  );
}
