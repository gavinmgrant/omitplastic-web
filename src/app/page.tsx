import SearchInput from "@/components/search-input"

export default async function Home() {
  return (
    <>
      <div className="antialiased bg-[url(/images/home.webp)] bg-cover bg-center absolute top-0 left-0 w-full h-full -z-10 bg-fixed" />
      <div className="bg-cover bg-center absolute top-0 left-0 w-full h-full bg-linear-to-t from-transparent to-white -z-10" />

      <div className="top-0 left-0 w-full h-full flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md">
          <SearchInput
            expanded={true}
            placeholder="Search for products with less plastic"
          />
        </div>
      </div>
    </>
  )
}
