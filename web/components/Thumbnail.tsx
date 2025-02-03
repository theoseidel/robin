import { motion } from "framer-motion"

interface ThumbnailProps {
  onClick: () => void
  imageUrl: string | null
  commonName?: string
  date?: string
}

export default function Thumbnail({ onClick, imageUrl }: ThumbnailProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative w-32 h-32 rounded-full overflow-hidden bg-black flex items-center justify-center"
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Bird"
          className="w-full h-full object-cover rounded-full"
        />
      ) : null}
    </motion.button>
  )
}
