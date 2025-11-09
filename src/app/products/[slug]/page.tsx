import type { Metadata } from "next"
import { getProductBySlug } from "@/lib/products"
import Product from "@/components/product"
import { notFound } from "next/navigation"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  return {
    title: product?.name,
    description: product?.description,
    openGraph: {
      title: product?.name || "OmitPlastic",
      description: product?.description || "",
      images: [product?.imageUrl || ""],
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return <Product product={product} />
}
