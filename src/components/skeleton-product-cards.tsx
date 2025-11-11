const SkeletonProductCards = () => {
  const cards = Array.from({ length: 9 }, (_, index) => index)
  return (
    <>
      {cards.map((card) => (
        <div key={card} className="animate-pulse">
          <div className="h-[318px] w-full bg-gray-200 rounded-xl"></div>
        </div>
      ))}
    </>
  )
}

export default SkeletonProductCards
