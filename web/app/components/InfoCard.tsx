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
  allSightings: Bird[]
}

interface BirdInfo {
  speciesCode: string
  order: string
  family: string
  bandingCodes: string[]
}

export default function InfoCard({
  selectedItem,
  selectedId,
  allSightings,
}: InfoCardProps) {
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
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      {/* Bird Info Section - Fixed height with overflow */}
      <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 p-4 shrink-0 overflow-y-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Larger image container */}
          <div className="w-full md:w-96 h-96 flex-shrink-0">
            <img
              src={selectedItem.imageUrl}
              alt={selectedItem.name}
              className="w-full h-full object-cover rounded-lg shadow-lg"
              onError={(e) => (e.currentTarget.src = "/fallback-bird.jpg")}
            />
          </div>

          {/* Info content with larger text */}
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">{selectedItem.name}</h2>
              <p className="text-gray-400 italic text-xl">
                {selectedItem.sciName}
              </p>
            </div>

            {birdInfo && (
              <div className="grid grid-cols-2 gap-6 text-base text-gray-300">
                <div className="space-y-2">
                  <p className="font-medium text-gray-400 text-lg mb-3">
                    Taxonomy
                  </p>
                  <p>Order: {birdInfo.order}</p>
                  <p>Family: {birdInfo.family}</p>
                  {birdInfo.bandingCodes.length > 0 && (
                    <p>Banding Codes: {birdInfo.bandingCodes.join(", ")}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-gray-400 text-lg mb-3">
                    Sighting Details
                  </p>
                  <p>Date: {format(new Date(selectedItem.dateTime), "PPP")}</p>
                  <p>Time: {format(new Date(selectedItem.dateTime), "pp")}</p>
                  <p>
                    Coordinates: {selectedItem.lat.toFixed(4)},{" "}
                    {selectedItem.lng.toFixed(4)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Map Section - Larger flex grow */}
      <div className="flex-[2] min-h-0 bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden">
        <Map selectedItem={selectedItem} className="w-full h-full" />
      </div>

      {/* Chat Section - Smaller flex grow */}
      <div className="flex-1 min-h-0">
        <BirdChat
          sciName={selectedItem.sciName}
          birdName={selectedItem.name}
          additionalInfo={{
            order: birdInfo?.order,
            family: birdInfo?.family,
            location: `${selectedItem.lat}, ${selectedItem.lng}`,
            sightingDate: selectedItem.dateTime,
          }}
        />
      </div>
    </div>
  )
}
