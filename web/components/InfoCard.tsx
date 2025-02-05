import React from "react"

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

interface InfoCardProps {
  selectedItem: Bird
}

export default function InfoCard({ selectedItem }: InfoCardProps) {
  return (
    <div className="flex w-full  border rounded-lg p-4">
      {/* Left Column - Info */}
      <div className="w-2/3 flex flex-col justify-center  outline-dotted"></div>

      {/* Right Column - Image */}
      <div
        className="w-1/3 flex flex-col 
        outline-dashed p-2"
      >
        <img
          src={selectedItem.imageUrl}
          alt={selectedItem.name}
          className=" object-contain rounded-md"
          onError={(e) => (e.currentTarget.src = "/fallback-bird.jpg")}
        />
        <div>info</div>
      </div>
    </div>
  )
}
