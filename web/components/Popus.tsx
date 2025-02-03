import { motion } from "framer-motion"

interface PopupProps {
  birdName: string
  imageUrl: string | null
  date?: string
  onClose: () => void
}

export default function Popup({
  birdName,
  imageUrl,
  date,
  onClose,
}: PopupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose} // Close when clicking outside the popup
    >
      <motion.div
        className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <button
          className="self-end text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={birdName}
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>
        <h2 className="text-lg font-bold">{birdName}</h2>
        <p className="text-gray-500">{date}</p>
      </motion.div>
    </motion.div>
  )
}
