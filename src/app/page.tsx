import SearchInput from "@/components/search-input"
import HomeVideo from "@/components/home-video"
import { Button } from "@/components/ui/button"
import { categoryOptions } from "@/config/categories"
import Link from "next/link"

export default async function Home() {
  return (
    <>
      <div className="bg-cover bg-center fixed top-0 left-0 w-full h-full bg-linear-to-t from-white/5 to-white to-95% backdrop-blur-xs -z-10" />
      <HomeVideo />

      <div className="top-0 left-0 w-full flex flex-col items-center justify-center h-full z-10">
        <div className="w-full fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-7 sm:leading-8">
            Buying less plastic means less plastic waste
          </h1>
          <p className="mb-8 mt-4 sm:mt-3">
            Find products that use less or no plastic. Search by keyword or
            select a category to get started.
          </p>
          <div className="w-full max-w-[523px] mx-auto">
            <SearchInput
              expanded={true}
              disableExpand={true}
              placeholder="Search by keyword"
              padding="py-5"
            />
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              {categoryOptions.map((category) => {
                if (category.value !== "all") {
                  return (
                    <Link
                      key={category.value}
                      href={`/products?category=${category.value}`}
                      className="text-sm text-muted-foreground"
                    >
                      <Button variant="outline" size="sm">
                        {category.label}
                      </Button>
                    </Link>
                  )
                }
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
