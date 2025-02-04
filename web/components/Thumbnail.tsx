import { motion } from "framer-motion"

interface ThumbnailProps {
  onClick: () => void
  imageUrl: string | null
  commonName?: string
  date?: string
  loading?: boolean
}

export default function Thumbnail({
  onClick,
  imageUrl,
  loading,
}: ThumbnailProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative w-32 h-32 rounded-full overflow-hidden bg-black flex items-center justify-center"
    >
      {loading ? (
        <motion.div
          className="absolute w-8 h-8 text-white"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          style={{ position: "absolute", top: "10%", left: "10%" }}
        >
          🐦
        </motion.div>
      ) : imageUrl ? (
        <img
          src={imageUrl}
          alt="Bird"
          className="w-full h-full object-cover rounded-full"
        />
      ) : null}
    </motion.button>
  )
}
