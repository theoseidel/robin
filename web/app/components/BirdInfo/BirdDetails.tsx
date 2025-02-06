import { format } from "date-fns"
import type { Bird, BirdInfo } from "@/types"

interface BirdDetailsProps {
  bird: Bird
  birdInfo: BirdInfo
}

export function BirdDetails({ bird, birdInfo }: BirdDetailsProps) {
  return (
    <div className="grid grid-cols-2 gap-6 text-base text-gray-300">
      <TaxonomySection birdInfo={birdInfo} />
      <SightingDetails bird={bird} />
    </div>
  )
}

function TaxonomySection({ birdInfo }: { birdInfo: BirdInfo }) {
  return (
    <div className="space-y-2">
      <p className="font-medium text-gray-400 text-lg mb-3">Taxonomy</p>
      <p>Order: {birdInfo.order}</p>
      <p>Family: {birdInfo.family}</p>
      {birdInfo.bandingCodes.length > 0 && (
        <p>Banding Codes: {birdInfo.bandingCodes.join(", ")}</p>
      )}
    </div>
  )
}

function SightingDetails({ bird }: { bird: Bird }) {
  return (
    <div className="space-y-2">
      <p className="font-medium text-gray-400 text-lg mb-3">Sighting Details</p>
      <p>Date: {format(new Date(bird.dateTime), "PPP")}</p>
      <p>Time: {format(new Date(bird.dateTime), "pp")}</p>
      <p>
        Coordinates: {bird.lat.toFixed(4)}, {bird.lng.toFixed(4)}
      </p>
    </div>
  )
}
