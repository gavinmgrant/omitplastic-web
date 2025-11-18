import Image from "next/image"

export default function HomeVideo() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-20">
      <video
        playsInline
        autoPlay
        muted
        loop
        preload="auto"
        id="home-video"
        className="w-full h-full object-cover"
      >
        <source src="/videos/home.mp4" type="video/mp4" />
      </video>
      <Image
        src="/images/home.webp"
        alt="Home"
        fill
        className="object-cover -z-30"
        loading="eager"
      />
    </div>
  )
}
