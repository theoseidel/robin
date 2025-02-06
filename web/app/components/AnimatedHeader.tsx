"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface Bird {
  id: string
  yOffset: number
  xOffset: number
}

// Unique ID generator
const generateId = () => Math.random().toString(36).substr(2, 9)

export default function AnimatedHeader() {
  const [birds, setBirds] = useState<Bird[]>([])

  useEffect(() => {
    // Create initial birds with spread out positions
    setBirds([
      { id: generateId(), yOffset: -40, xOffset: -200 },
      { id: generateId(), yOffset: 0, xOffset: 0 },
      { id: generateId(), yOffset: 40, xOffset: 200 },
    ])

    // Add new birds periodically with random positions
    const interval = setInterval(() => {
      setBirds((prev) => {
        const newBird = {
          id: generateId(),
          yOffset: Math.random() * 120 - 60, // Random value between -60 and 60
          xOffset: Math.random() * 400 - 200, // Random value between -200 and 200
        }
        const updatedBirds = [...prev, newBird]
        return updatedBirds.slice(-5) // Keep last 5 birds
      })
    }, 4000) // Increased interval between new birds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-20 flex items-center justify-center overflow-hidden">
      {/* Flying birds */}
      {birds.map((bird) => (
        <motion.div
          key={bird.id}
          className="absolute"
          initial={{
            x: `calc(-50vw + ${bird.xOffset}px)`,
            y: bird.yOffset,
            scale: 0.6,
          }}
          animate={{
            x: `calc(50vw + ${bird.xOffset}px)`,
            y: bird.yOffset,
            scale: 0.6,
          }}
          transition={{
            duration: 25, // Increased duration for slower movement
            ease: [0.4, 0, 0.2, 1], // Custom easing for smoother motion
            delay: 0.5, // Consistent delay for all birds
          }}
        >
          <motion.div
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 3, // Slower wing movement
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "reverse",
            }}
          >
            <div className="bird w-24 h-32 [filter:brightness(0)_invert(1)_opacity(0.2)]" />
          </motion.div>
        </motion.div>
      ))}

      {/* Title */}
      <h1 className="text-6xl font-bold tracking-wider relative z-20 text-white drop-shadow-lg">
        ROBIN
      </h1>
    </div>
  )
}
