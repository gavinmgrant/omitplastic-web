import { notFound } from "next/navigation"
import Image from "next/image"
import type { Metadata } from "next"
import { reader } from "@/app/keystatic/reader"
import { MDXRemote } from "next-mdx-remote/rsc"
import ProductList from "@/components/product-list"

interface GuidePageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const guides = await reader.collections.guides.all()
  return guides.map((guide) => ({
    slug: guide.slug,
  }))
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params
  const guide = await reader.collections.guides.read(slug)

  if (!guide) {
    return {
      title: "Guide Not Found",
    }
  }

  return {
    title: guide.title,
    description: guide.description,
    openGraph: {
      title: guide.title,
      description: guide.description,
      images: guide.coverImage ? [`/uploads/guides/${guide.coverImage}`] : [],
    },
  }
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params
  const guide = await reader.collections.guides.read(slug)

  if (!guide) {
    notFound()
  }

  const coverImage = guide.coverImage
    ? `/uploads/guides/${guide.coverImage}`
    : null

  // Get the MDX content as a string
  const content = await guide.content()

  const components = {
    ProductList,
  }

  return (
    <article className="max-w-6xl mx-auto prose">
      <header className="mb-12">
        {coverImage && (
          <div className="relative w-full h-48 sm:h-72 lg:h-88 mb-6 rounded-lg overflow-hidden">
            <Image
              src={coverImage}
              alt={guide.title}
              fill
              className="object-cover p-0! m-0!"
              priority
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        )}
        <h1 className="font-bold mb-4">{guide.title}</h1>
        {guide.description && (
          <p className="text-xl text-muted-foreground mb-4">
            {guide.description}
          </p>
        )}
      </header>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <MDXRemote source={content} components={components} />
      </div>
    </article>
  )
}
