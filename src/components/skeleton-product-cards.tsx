const SkeletonProductCards = () => {
  const cards = Array.from({ length: 12 }, (_, index) => index)
  return (
    <>
      {cards.map((card) => (
        <div key={card} className="animate-pulse">
          <div className="h-[350px] w-full bg-gray-200 rounded-xl"></div>
        </div>
      ))}
    </>
  )
}

export default SkeletonProductCards
