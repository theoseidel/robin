import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

// Set your Mapbox token with the correct env variable name
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!

type Bird = {
  lat: number
  lng: number
  name: string
  dateTime: string
}

interface MapProps {
  selectedItem: Bird
  className?: string
}

export default function Map({ selectedItem, className = "" }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const marker = useRef<mapboxgl.Marker | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [selectedItem.lng, selectedItem.lat],
        zoom: 12,
      })

      map.current.addControl(new mapboxgl.NavigationControl())
    }

    // Update or create marker
    if (!marker.current) {
      marker.current = new mapboxgl.Marker()
        .setLngLat([selectedItem.lng, selectedItem.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-2">
              <h3 class="font-bold">${selectedItem.name}</h3>
              <p class="text-sm">${new Date(
                selectedItem.dateTime
              ).toLocaleDateString()}</p>
            </div>
          `)
        )
        .addTo(map.current)
    } else {
      marker.current.setLngLat([selectedItem.lng, selectedItem.lat])
    }

    // Fly to new location
    map.current.flyTo({
      center: [selectedItem.lng, selectedItem.lat],
      zoom: 12,
      duration: 2000,
    })

    return () => {
      if (marker.current) {
        marker.current.remove()
        marker.current = null
      }
    }
  }, [selectedItem])

  return <div ref={mapContainer} className={className} />
}
