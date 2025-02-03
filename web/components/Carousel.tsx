import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import Thumbnail from "./Thumbnail"

const API_BASE = "https://nuthatch.lastelm.software/v2/birds?sciName="
const API_KEY = "0c69afd9-add3-401e-a2af-9d8f42950985"

interface Bird {
  sciName: string
  dateTime: string
}

interface BirdDetails {
  commonName?: string
  imageUrl: string | null
}

interface CarouselProps {
  birds: Bird[]
}

export default function Carousel({ birds }: CarouselProps) {
  const [birdDetails, setBirdDetails] = useState<{
    [key: string]: BirdDetails
  }>({})
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

            if (
              !data ||
              !Array.isArray(data.entities) ||
              data.entities.length === 0
            ) {
              newBirdDetails[bird.sciName] = {
                imageUrl: null,
                commonName: bird.sciName,
              }
            } else {
              newBirdDetails[bird.sciName] = {
                imageUrl:
                  data.entities[0].images.length > 0
                    ? data.entities[0].images[0]
                    : null,
                commonName: data.entities[0].comName || bird.sciName,
              }
            }
          } catch (error) {
            console.error(`Error fetching data for ${bird.sciName}:`, error)
            newBirdDetails[bird.sciName] = {
              imageUrl: null,
              commonName: bird.sciName,
            }
          }
        })
      )

      setBirdDetails(newBirdDetails)
    }

    fetchBirdDetails()
  }, [birds])

  // Calculate scrollable height dynamically
  const thumbnailHeight = 140 // Each thumbnail is 140px tall (w-32 h-32 + margin)
  const visibleHeight = 500 // Fixed height for the visible carousel area
  const scrollableHeight = sortedBirds.length * thumbnailHeight - visibleHeight // Total scrollable area

  return (
    <div className=" h-5/6 p-2 flex justify-center outline-dotted">
      <div
        ref={carouselRef}
        className="  w-[140px] overflow-hidden overflow-y-auto"
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
              date={bird.dateTime}
              onClick={() => {}}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}
