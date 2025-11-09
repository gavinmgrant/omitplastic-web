import { Spinner } from "@/components/ui/spinner"

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="flex items-center justify-center gap-2">
        <Spinner className="w-6 h-6" />
        <p>Loading...</p>
      </div>
    </div>
  )
}
