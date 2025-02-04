import { useState, useEffect } from "react"
import { motion } from "framer-motion"

const API_BASE = process.env.NEXT_PUBLIC_BIRD_API_BASE_URL
const API_KEY = process.env.NEXT_PUBLIC_BIRD_API_KEY || ""

interface Bird {
  sciName: string
  dateTime: string
}

interface BirdDetails {
  name: string
  imageUrl?: string
  family: string
  order: string
}

interface BirdGridProps {
  birds: Bird[]
}

function BirdCard({ details }: { details: BirdDetails }) {
  return (
    <motion.div
      className="relative w-full h-[400px] bg-gray-700 rounded-lg overflow-hidden shadow-lg"
      whileHover={{
        scale: 1.03,
        boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.3)",
      }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      {/* Image Background */}
      {details.imageUrl ? (
        <img
          src={details.imageUrl}
          alt={details.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex items-center justify-center h-full bg-gray-800 text-gray-400">
          No Image
        </div>
      )}

      {/* 🔹 Semi-Transparent Overlay (Matches Audubon UI) */}
      <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 text-white p-4">
        <h3 className="text-lg font-semibold">{details.name}</h3>
        <p className="text-sm text-gray-300 uppercase">{details.family}</p>
      </div>
    </motion.div>
  )
}

export default function BirdGrid({ birds }: BirdGridProps) {
  const [birdDetails, setBirdDetails] = useState<{
    [key: string]: BirdDetails
  }>({})

  useEffect(() => {
    const fetchBirdDetails = async () => {
      const newBirdDetails: { [key: string]: BirdDetails } = {}

      await Promise.all(
        birds.map(async (bird) => {
          try {
            const response = await fetch(
              `${API_BASE}${encodeURIComponent(bird.sciName)}`,
              {
                headers: { "api-key": API_KEY },
              }
            )

            if (!response.ok)
              throw new Error(`Failed to fetch data for ${bird.sciName}`)

            const data = await response.json()
            const entity = data.entities?.[0] || {}

            newBirdDetails[bird.sciName] = {
              name: entity.name || bird.sciName,
              imageUrl: entity.images?.[0] || undefined,
              family: entity.family || "Unknown",
              order: entity.order || "Unknown",
            }
          } catch (error) {
            console.error(`Error fetching data for ${bird.sciName}:`, error)
            newBirdDetails[bird.sciName] = {
              name: bird.sciName,
              imageUrl: undefined,
              family: "Unknown",
              order: "Unknown",
            }
          }
        })
      )

      setBirdDetails(newBirdDetails)
    }

    fetchBirdDetails()
  }, [birds])

  return (
    <div className="min-h-screen p-6 bg-darkBlue text-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {birds.map((bird, index) => {
          const details = birdDetails[bird.sciName] || {}
          return <BirdCard key={index} details={details} />
        })}
      </div>
    </div>
  )
}
