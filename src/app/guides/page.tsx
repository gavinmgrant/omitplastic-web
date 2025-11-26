import Link from "next/link"
import Image from "next/image"
import { reader } from "@/app/keystatic/reader"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function GuidesPage() {
  const guides = await reader.collections.guides.all()

  // Sort by publishedAt date, most recent first
  const sortedGuides = guides.sort((a, b) => {
    const dateA = a.entry.publishedAt
      ? new Date(a.entry.publishedAt).getTime()
      : 0
    const dateB = b.entry.publishedAt
      ? new Date(b.entry.publishedAt).getTime()
      : 0
    return dateB - dateA
  })

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Guides</h1>
        <p className="text-muted-foreground text-lg">
          Learn how to reduce plastic waste with our practical guides and tips.
        </p>
      </div>

      {sortedGuides.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No guides available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {sortedGuides.map((guide) => {
            const { slug, entry } = guide
            const coverImage = entry.coverImage
              ? `/uploads/guides/${entry.coverImage}`
              : null

            return (
              <Link key={slug} href={`/guides/${slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow pt-0 pb-6">
                  {coverImage && (
                    <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                      <Image
                        src={coverImage}
                        alt={entry.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl font-bold leading-tight">
                      {entry.title}
                    </CardTitle>
                    {entry.description && (
                      <CardDescription className="line-clamp-3">
                        {entry.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
