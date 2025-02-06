import React, { useState, useEffect } from "react"
import { format } from "date-fns"
import Map from "./Map"
import BirdChat from "./BirdChat"

type Bird = {
  id: number
  name: string
  sciName: string
  speciesCode: string
  dateTime: string
  lat: number
  lng: number
  url: string
  imageUrl?: string
}

interface InfoCardProps {
  selectedItem: Bird
  selectedId: number | null
}

interface BirdInfo {
  speciesCode: string
  order: string
  family: string
  bandingCodes: string[]
}

export default function InfoCard({ selectedItem, selectedId }: InfoCardProps) {
  const [birdInfo, setBirdInfo] = useState<BirdInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBirdInfo = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(
          `/api/ebird/species-code/${encodeURIComponent(selectedItem.sciName)}`
        )
        const data = await response.json()
        setBirdInfo(data)
      } catch (error) {
        console.error("Error fetching bird info:", error)
      }
      setIsLoading(false)
    }

    fetchBirdInfo()
  }, [selectedItem.sciName])

  return (
    <div className="flex flex-col h-full bg-gray-800/50 rounded-lg border border-gray-700 p-4 gap-4">
      {/* Top Section - Bird Info */}
      <div className="flex gap-4">
        <div className="w-1/3">
          <img
            src={selectedItem.imageUrl}
            alt={selectedItem.name}
            className="w-full aspect-square object-cover rounded-lg"
            onError={(e) => (e.currentTarget.src = "/fallback-bird.jpg")}
          />
        </div>
        <div className="flex-1">
          <div>
            <h2 className="text-2xl font-bold">{selectedItem.name}</h2>
            <p className="text-gray-400 italic">{selectedItem.sciName}</p>
            {birdInfo && (
              <div className="mt-2 space-y-1 text-sm text-gray-300">
                <p>Family: {birdInfo.family}</p>
                <p>Order: {birdInfo.order}</p>
                {birdInfo.bandingCodes.length > 0 && (
                  <p>Banding Codes: {birdInfo.bandingCodes.join(", ")}</p>
                )}
              </div>
            )}
          </div>
          <div className="mt-4">
            <p className="text-sm">
              Recorded on:{" "}
              {format(new Date(selectedItem.dateTime), "PPP 'at' pp")}
            </p>
            <p className="text-sm">
              Location: {selectedItem.lat}, {selectedItem.lng}
            </p>
          </div>
        </div>
      </div>

      {/* Middle Section - Voice Assistant */}
      <div className="flex-1 min-h-[200px]">
        <BirdChat sciName={selectedItem.sciName} birdName={selectedItem.name} />
      </div>

      {/* Bottom Section - Map */}
      <div className="flex-1 min-h-0">
        <Map
          lat={selectedItem.lat}
          lng={selectedItem.lng}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
