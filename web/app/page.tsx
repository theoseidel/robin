"use client"

import { useEffect, useState } from "react"
import { useBirds } from "./hooks/useBirds"
import Gallery from "./components/Gallery"
import InfoCard from "./components/InfoCard"
import FilterBar from "./components/FilterBar"
import RobinLoader from "./components/RobinLoader"
import AnimatedHeader from "./components/AnimatedHeader"
import { ErrorBoundary } from "./components/ErrorBoundary"

type Bird = {
  id: number
  name: string
  sciName: string
  dateTime: string
  lat: number
  lng: number
  url: string
  imageUrl?: string
  speciesCode: string
}

// Add image cache at the top level
const imageCache = new Map<string, string>()

const getWikimediaImage = async (sciName: string): Promise<string> => {
  // Check cache first
  if (imageCache.has(sciName)) {
    return imageCache.get(sciName)!
  }

  try {
    const searchQuery = encodeURIComponent(sciName)
    const response = await fetch(
      `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${searchQuery}&format=json&origin=*&srnamespace=6`
    )
    const data = await response.json()

    const imageUrl = data.query?.search?.[0]
      ? `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
          data.query.search[0].title
        )}`
      : "/placeholder-bird.jpg"

    // Cache the result
    imageCache.set(sciName, imageUrl)
    return imageUrl
  } catch (error) {
    console.error("Error fetching Wikimedia image:", error)
    return "/placeholder-bird.jpg"
  }
}

export default function Page() {
  const {
    birds,
    initialLoading,
    imagesLoading,
    error,
    hasMore,
    loadMore,
    filterByDateRange,
    filterBySearch,
    filterBySort,
  } = useBirds()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [showLoader, setShowLoader] = useState(true)

  // Handle loader state
  useEffect(() => {
    if (!initialLoading) {
      const timer = setTimeout(() => {
        setShowLoader(false)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [initialLoading])

  const selectedBird = birds.find((bird) => bird.id === selectedId) || birds[0]

  if (showLoader) {
    return <RobinLoader />
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 text-red-400 rounded-lg">
        <h2 className="text-lg font-medium mb-2">Error loading birds</h2>
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  return (
    <main className="h-screen bg-darkBlue text-white p-4 md:p-8">
      <div className="h-full w-full max-w-7xl mx-auto flex flex-col">
        <AnimatedHeader />
        <ErrorBoundary>
          <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-4 md:gap-6">
            <div className="md:w-80 order-2 md:order-1 flex flex-col min-h-0">
              <div className="mb-4">
                <FilterBar
                  onDateRangeChange={filterByDateRange}
                  onSearch={filterBySearch}
                  onSortChange={filterBySort}
                />
              </div>
              <div className="flex-1 min-h-0 overflow-auto">
                <Gallery
                  items={birds}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  loading={imagesLoading}
                  onLoadMore={loadMore}
                  hasMore={hasMore}
                />
              </div>
            </div>

            {selectedBird && (
              <div className="flex-1 order-1 md:order-2 min-h-0 overflow-auto">
                <InfoCard
                  selectedItem={selectedBird}
                  selectedId={selectedId}
                  allSightings={birds}
                />
              </div>
            )}
          </div>
        </ErrorBoundary>
      </div>
    </main>
  )
}
