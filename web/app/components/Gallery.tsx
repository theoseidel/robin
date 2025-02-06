import React, { useRef, useEffect } from "react"
import { motion } from "framer-motion"

type Bird = {
  id: number
  name: string
  sciName: string
  dateTime: string
  lat: number
  lng: number
  url: string
  imageUrl?: string
}

interface GalleryProps {
  items: Bird[]
  selectedId: number | null
  onSelect: (id: number) => void
  loading: boolean
  onLoadMore: () => void
  hasMore: boolean
}

export default function Gallery({
  items,
  selectedId,
  onSelect,
  loading,
  onLoadMore,
  hasMore,
}: GalleryProps) {
  // Intersection Observer for infinite scroll
  const observerTarget = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [hasMore, loading, onLoadMore])

  return (
    <div className="h-[30vh] md:h-[85vh] w-full md:w-80 flex-shrink-0 bg-gray-800/50 rounded-lg border border-gray-700">
      <div className="h-full overflow-x-auto md:overflow-x-hidden overflow-y-hidden md:overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        <div className="flex flex-row md:flex-col gap-4 p-4 h-24 md:h-auto">
          {items.map((bird) => (
            <Thumbnail
              key={bird.id}
              bird={bird}
              isSelected={selectedId === bird.id}
              onSelect={onSelect}
              loading={!bird.imageUrl}
            />
          ))}
          {hasMore && <div ref={observerTarget} className="h-4" />}
          {loading && (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Thumbnail({
  bird,
  isSelected,
  onSelect,
  loading,
}: {
  bird: Bird
  isSelected: boolean
  onSelect: (id: number) => void
  loading: boolean
}) {
  return (
    <motion.div
      className={`cursor-pointer relative h-24 md:h-40 w-24 md:w-full aspect-square rounded-lg overflow-hidden flex-shrink-0 ${
        isSelected ? "z-10" : "z-0"
      }`}
      onClick={() => onSelect(bird.id)}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isSelected ? 1.05 : 1,
      }}
      whileHover={{
        scale: isSelected ? 1.05 : 1.02,
        boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
        mass: 1,
      }}
      layout
    >
      {loading ? (
        <div className="w-full h-full bg-gray-700 animate-pulse" />
      ) : (
        <motion.div
          initial={false}
          animate={{
            boxShadow: isSelected
              ? "0 0 0 2px rgb(59, 130, 246)"
              : "0 0 0 0px transparent",
          }}
          className="w-full h-full"
        >
          <img
            src={bird.imageUrl}
            alt={bird.name}
            className="w-full h-full object-cover"
            onError={(e) => (e.currentTarget.src = "/fallback-bird.jpg")}
          />
          <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 backdrop-blur-sm text-white text-sm p-2 text-center">
            {bird.name}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
