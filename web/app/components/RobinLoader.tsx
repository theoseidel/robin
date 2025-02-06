import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

export default function RobinLoader() {
  const letters = "ROBIN".split("")
  const [showAnimation, setShowAnimation] = useState(false)
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    // Start animation sooner
    const showTimeout = setTimeout(() => {
      setShowAnimation(true)
    }, 300)

    // Reduce total duration
    const doneTimeout = setTimeout(() => {
      setIsDone(true)
    }, 4000)

    return () => {
      clearTimeout(showTimeout)
      clearTimeout(doneTimeout)
    }
  }, [])

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          className="h-screen w-full flex items-center justify-center bg-darkBlue"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex gap-2">
            {letters.map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  showAnimation
                    ? {
                        opacity: [0, 1, 1, 0],
                        y: [20, 0, 0, 20],
                      }
                    : {}
                }
                transition={{
                  delay: i * 0.2,
                  duration: 2.5,
                  times: [0, 0.2, 0.8, 1],
                  ease: "easeInOut",
                }}
                className="text-6xl font-bold text-white"
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
