import React, { useRef, useEffect, useState } from "react"
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

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="flex gap-4 p-2 rounded-lg bg-gray-800/50 border border-gray-700/50">
            {/* Thumbnail skeleton */}
            <div className="w-24 h-24 rounded-lg bg-gray-700/50" />

            {/* Text content skeleton */}
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 w-3/4 bg-gray-700/50 rounded" />
              <div className="h-3 w-1/2 bg-gray-700/50 rounded" />
              <div className="h-3 w-1/4 bg-gray-700/50 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Gallery({
  items,
  selectedId,
  onSelect,
  loading,
  onLoadMore,
  hasMore,
}: GalleryProps) {
  const observerTarget = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

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

  if (loading && items.length === 0) {
    return (
      <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-700 pr-2">
        <LoadingSkeleton />
      </div>
    )
  }

  return (
    <div
      className="h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-700 pr-2"
      ref={scrollContainerRef}
    >
      <div className="space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`w-full aspect-square rounded-lg overflow-hidden border transition-all relative ${
              selectedId === item.id
                ? "border-blue-500 ring-2 ring-blue-500/50"
                : "border-gray-700/50 hover:border-gray-600"
            }`}
          >
            {item.imageUrl ? (
              <>
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.src = "/fallback-bird.jpg")}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-2 text-white">
                  <div className="text-sm font-medium">{item.name}</div>
                  <div className="text-xs text-gray-300 italic">
                    {item.sciName}
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-gray-800/50 animate-pulse" />
            )}
          </button>
        ))}
      </div>
      {hasMore && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => onLoadMore()}
            disabled={loading}
            className="px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700/50 text-sm text-gray-300 hover:bg-gray-800/70 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  )
}

function Thumbnail({
  bird,
  isSelected,
  onSelect,
}: {
  bird: Bird
  isSelected: boolean
  onSelect: (id: number) => void
}) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

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
      {!imageLoaded && !imageError && <LoadingThumbnail />}
      <motion.div
        initial={false}
        animate={{
          boxShadow: isSelected
            ? "0 0 0 2px rgb(59, 130, 246)"
            : "0 0 0 0px transparent",
        }}
        className={`w-full h-full ${!imageLoaded ? "hidden" : ""}`}
      >
        <img
          src={bird.imageUrl}
          alt={bird.name}
          className="w-full h-full object-cover"
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            setImageError(true)
            e.currentTarget.src = "/fallback-bird.jpg"
          }}
        />
        <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 backdrop-blur-sm text-white text-sm p-2 text-center">
          {bird.name}
        </div>
      </motion.div>
    </motion.div>
  )
}

function LoadingThumbnail() {
  return (
    <div className="h-24 md:h-40 w-24 md:w-full rounded-lg overflow-hidden">
      <div className="w-full h-full bg-gray-700/50 animate-pulse flex items-center justify-center">
        <svg
          className="w-8 h-8 text-gray-600 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    </div>
  )
}
