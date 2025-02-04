import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import Thumbnail from "./Thumbnail"

const API_BASE = process.env.NEXT_PUBLIC_BIRD_API_BASE_URL
const API_KEY = process.env.NEXT_PUBLIC_BIRD_API_KEY || ""

interface Bird {
  sciName: string
  dateTime: string
}

interface BirdDetails {
  commonName?: string
  imageUrl: string | null
  loading: boolean
}

interface CarouselProps {
  birds: Bird[]
}

export default function Carousel({ birds }: CarouselProps) {
  const [birdDetails, setBirdDetails] = useState<{
    [key: string]: BirdDetails
  }>(() =>
    birds.reduce((acc, bird) => {
      acc[bird.sciName] = {
        imageUrl: null,
        commonName: bird.sciName,
        loading: true,
      }
      return acc
    }, {} as { [key: string]: BirdDetails })
  )
  const carouselRef = useRef<HTMLDivElement>(null)

  // Sort birds by date (newest first)
  const sortedBirds = [...birds].sort(
    (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
  )

  useEffect(() => {
    const fetchBirdDetails = async () => {
      const newBirdDetails: { [key: string]: BirdDetails } = {}

      await Promise.all(
        sortedBirds.map(async (bird) => {
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

            newBirdDetails[bird.sciName] = {
              imageUrl: data.entities?.[0]?.images?.[0] || null,
              commonName: data.entities?.[0]?.comName || bird.sciName,
              loading: false,
            }
          } catch (error) {
            console.error(`Error fetching data for ${bird.sciName}:`, error)
            newBirdDetails[bird.sciName] = {
              imageUrl: null,
              commonName: bird.sciName,
              loading: false,
            }
          }
        })
      )

      setBirdDetails((prev) => ({ ...prev, ...newBirdDetails }))
    }

    fetchBirdDetails()
  }, [birds])

  // Calculate scrollable height dynamically
  const thumbnailHeight = 140 // Each thumbnail is 140px tall (w-32 h-32 + margin)
  const visibleHeight = 500 // Fixed height for the visible carousel area
  const scrollableHeight = sortedBirds.length * thumbnailHeight - visibleHeight // Total scrollable area

  return (
    <div className="h-5/6 p-2 flex justify-center outline-dotted">
      <div
        ref={carouselRef}
        className="w-[140px] overflow-hidden overflow-y-auto"
      >
        {/* Draggable Thumbnails */}
        <motion.div
          drag="y"
          dragConstraints={{ top: -scrollableHeight, bottom: 0 }}
          className="flex flex-col items-center gap-4 p-2 cursor-grab active:cursor-grabbing"
        >
          {sortedBirds.map((bird, index) => (
            <Thumbnail
              key={index}
              imageUrl={birdDetails[bird.sciName]?.imageUrl}
              commonName={birdDetails[bird.sciName]?.commonName}
              loading={birdDetails[bird.sciName]?.loading}
              date={bird.dateTime}
              onClick={() => {}}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}
