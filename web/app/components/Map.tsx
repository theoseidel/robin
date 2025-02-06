import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

// Set your Mapbox token with the correct env variable name
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!

interface MapProps {
  lat: number
  lng: number
  isLoading?: boolean
}

export default function Map({ lat, lng, isLoading = false }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current || isLoading) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/navigation-night-v1",
      center: [lng, lat],
      zoom: 12,
    })

    map.current.addControl(new mapboxgl.NavigationControl())

    new mapboxgl.Marker({ color: "#FF0000" })
      .setLngLat([lng, lat])
      .setPopup(new mapboxgl.Popup().setHTML("Sighting location"))
      .addTo(map.current)

    return () => {
      map.current?.remove()
    }
  }, [lat, lng, isLoading])

  if (isLoading) {
    return (
      <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-800/50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin text-2xl">⟳</div>
          <p className="text-sm text-gray-400">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  )
}
