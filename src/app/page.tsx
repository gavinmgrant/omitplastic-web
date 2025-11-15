import SearchInput from "@/components/search-input"
import HomeVideo from "@/components/home-video"

export default async function Home() {
  return (
    <>
      <div className="bg-cover bg-center fixed top-0 left-0 w-full h-full bg-linear-to-t from-transparent to-white -z-10" />
      <HomeVideo />

      <div className="top-0 left-0 w-full flex flex-col items-center justify-center h-full">
        <div className="w-full max-w-md fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4">
          <SearchInput
            expanded={true}
            disableExpand={true}
            placeholder="Search for products with less plastic"
            padding="py-5"
          />
        </div>
      </div>
    </>
  )
}
