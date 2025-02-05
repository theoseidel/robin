"use client"

import { useEffect, useState } from "react"
import Gallery from "@/components/Gallery"
import InfoCard from "@/components/InfoCard"

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

// Function to get the Wikimedia image URL
const getWikimediaImage = (sciName: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${sciName.replace(
    " ",
    "_"
  )}.jpg`

export default function Page() {
  const [birds, setBirds] = useState<Bird[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  useEffect(() => {
    fetch("/api/birds")
      .then((res) => res.json())
      .then((data) => {
        const birdsWithImages = data.map((bird: Bird) => ({
          ...bird,
          imageUrl: getWikimediaImage(bird.sciName),
        }))
        setBirds(birdsWithImages)
        if (birdsWithImages.length > 0) setSelectedId(birdsWithImages[0].id)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching birds:", err)
        setLoading(false)
      })
  }, [])

  const selectedBird = birds.find((bird) => bird.id === selectedId) || birds[0]

  return (
    <main className="bg-darkBlue text-white h-screen p-8 flex flex-row gap-10">
      {loading ? (
        <p>Loading birds...</p>
      ) : (
        <>
          <Gallery
            items={birds}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
          {selectedBird && <InfoCard selectedItem={selectedBird} />}
        </>
      )}
    </main>
  )
}
