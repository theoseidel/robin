"use client"

import { useEffect, useState } from "react"

import BirdGrid from "@/components/BirdGrid"

import BirdModal from "@/components/BirdModal"

interface Bird {
  name: string
  sciName: string
  lat: number
  lng: number
  dateTime: string
}

interface BirdDetails extends Bird {
  family: string
  order: string
}

export default function Page() {
  const [birdSightings, setBirdSightings] = useState([])
  const [selectedBird, setSelectedBird] = useState<BirdDetails | null>(null)

  useEffect(() => {
    fetch("/data/birds.json")
      .then((response) => response.json())
      .then((data) => setBirdSightings(data))
      .catch((error) => console.error("Error loading bird sightings:", error))
  }, [])

  return (
    <main className="bg-darkBlue text-white min-h-screen p-5 relative">
      <div className="bg-darkBlue p-8 rounded-lg max-w-[1200px] mx-auto shadow-lg space-y-8">
        <h1 className="text-5xl font-bold">Robin</h1>
        <div className="w-full border-t border-gray-500"></div>

        <h1 className="text-2xl font-bold">Recent Sightings</h1>

        <BirdGrid birds={birdSightings} />
      </div>
      {selectedBird && (
        <BirdModal bird={selectedBird} onClose={() => setSelectedBird(null)} />
      )}
    </main>
  )
}
