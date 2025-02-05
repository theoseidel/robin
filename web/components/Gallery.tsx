import React from "react"
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
}

export default function Gallery({ items, selectedId, onSelect }: GalleryProps) {
  return (
    <div className="w-1/7 flex flex-col items-center justify-center">
      <div className="w-full max-h-[80vh] overflow-y-auto flex flex-col items-center gap-4">
        {items.map((bird) => (
          <Thumbnail
            key={bird.id}
            bird={bird}
            isSelected={selectedId === bird.id}
            onSelect={onSelect}
          />
        ))}
      </div>
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
  return (
    <motion.div
      className={`cursor-pointer relative w-[18vw] max-w-40 aspect-square rounded-lg overflow-hidden transition-all ${
        isSelected ? "scale-110 shadow-2xl" : "shadow-lg"
      }`}
      onClick={() => onSelect(bird.id)}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      whileHover={{ scale: 1.12 }}
      transition={{ type: "spring", stiffness: 150, damping: 20 }}
    >
      <img
        src={bird.imageUrl}
        alt={bird.name}
        className="w-full h-full object-cover"
        onError={(e) => (e.currentTarget.src = "/fallback-bird.jpg")}
      />

      {/* Name Overlay */}
      <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-sm p-2 text-center">
        {bird.name}
      </div>
    </motion.div>
  )
}
