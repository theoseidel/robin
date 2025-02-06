"use client"

import { useEffect, useState } from "react"
import Gallery from "./components/Gallery"
import InfoCard from "./components/InfoCard"
import FilterBar from "./components/FilterBar"

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
  const [birds, setBirds] = useState<Bird[]>([]) // Currently displayed birds
  const [allBirds, setAllBirds] = useState<Bird[]>([]) // Original complete dataset
  const [filteredBirds, setFilteredBirds] = useState<Bird[]>([]) // Filtered dataset
  const [initialLoading, setInitialLoading] = useState(true)
  const [imagesLoading, setImagesLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [dateRange, setDateRange] = useState({ start: "", end: "" })
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const ITEMS_PER_PAGE = 10

  // Fetch initial data
  useEffect(() => {
    fetch("/api/birds")
      .then((res) => res.json())
      .then((data) => {
        setAllBirds(data)
        setFilteredBirds(data)
        const initialBirds = data.slice(0, ITEMS_PER_PAGE)
        setBirds(initialBirds)
        if (initialBirds.length > 0) setSelectedId(initialBirds[0].id)
        setHasMore(data.length > ITEMS_PER_PAGE)
        setInitialLoading(false)
        loadImagesForBirds(initialBirds)
      })
  }, [])

  // Load more birds when scrolling
  const loadMore = () => {
    if (!imagesLoading && hasMore) {
      setImagesLoading(true)
      const nextBirds = filteredBirds.slice(
        birds.length,
        birds.length + ITEMS_PER_PAGE
      )
      setBirds((current) => [...current, ...nextBirds])
      setHasMore(birds.length + nextBirds.length < filteredBirds.length)
      loadImagesForBirds(nextBirds)
    }
  }

  const loadImagesForBirds = async (birdsToLoad: Bird[]) => {
    const BATCH_SIZE = 3
    for (let i = 0; i < birdsToLoad.length; i += BATCH_SIZE) {
      const batch = birdsToLoad.slice(i, i + BATCH_SIZE)
      const batchWithImages = await Promise.all(
        batch.map(async (bird) => ({
          ...bird,
          imageUrl: await getWikimediaImage(bird.sciName),
        }))
      )
      setBirds((current) => {
        const updated = [...current]
        batchWithImages.forEach((birdWithImage) => {
          const index = updated.findIndex((b) => b.id === birdWithImage.id)
          if (index !== -1) updated[index] = birdWithImage
        })
        return updated
      })
    }
    setImagesLoading(false)
  }

  // Helper function to preserve image URLs when filtering
  const preserveImageUrls = (filteredBirds: Bird[]): Bird[] => {
    return filteredBirds.map((bird) => {
      const existingBird =
        birds.find((b) => b.id === bird.id) ||
        allBirds.find((b) => b.id === bird.id)
      return {
        ...bird,
        imageUrl: existingBird?.imageUrl || bird.imageUrl,
      }
    })
  }

  const handleSort = (direction: "asc" | "desc") => {
    const sortedBirds = [...filteredBirds].sort((a, b) => {
      const comparison =
        new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
      return direction === "asc" ? comparison : -comparison
    })
    const sortedWithImages = preserveImageUrls(sortedBirds)
    setFilteredBirds(sortedWithImages)
    setBirds(sortedWithImages.slice(0, ITEMS_PER_PAGE))
    setHasMore(sortedBirds.length > ITEMS_PER_PAGE)
    setSortDirection(direction)
  }

  const handleDateRange = ({ start, end }: { start: string; end: string }) => {
    if (!start && !end) {
      const resetBirds = preserveImageUrls(allBirds)
      setFilteredBirds(resetBirds)
      setBirds(resetBirds.slice(0, ITEMS_PER_PAGE))
      setHasMore(allBirds.length > ITEMS_PER_PAGE)
      return
    }

    const filtered = allBirds.filter((bird) => {
      const birdDate = new Date(bird.dateTime).getTime()
      const startDate = start ? new Date(start).getTime() : 0
      const endDate = end ? new Date(end).getTime() : Infinity
      return birdDate >= startDate && birdDate <= endDate
    })
    const filteredWithImages = preserveImageUrls(filtered)
    setFilteredBirds(filteredWithImages)
    setBirds(filteredWithImages.slice(0, ITEMS_PER_PAGE))
    setHasMore(filtered.length > ITEMS_PER_PAGE)
  }

  const handleSearch = (query: string) => {
    if (!query) {
      const resetBirds = preserveImageUrls(allBirds)
      setFilteredBirds(resetBirds)
      setBirds(resetBirds.slice(0, ITEMS_PER_PAGE))
      setHasMore(allBirds.length > ITEMS_PER_PAGE)
      return
    }

    const filtered = allBirds.filter(
      (bird) =>
        bird.name.toLowerCase().includes(query.toLowerCase()) ||
        bird.sciName.toLowerCase().includes(query.toLowerCase())
    )
    const filteredWithImages = preserveImageUrls(filtered)
    setFilteredBirds(filteredWithImages)
    setBirds(filteredWithImages.slice(0, ITEMS_PER_PAGE))
    setHasMore(filtered.length > ITEMS_PER_PAGE)
  }

  const selectedBird = birds.find((bird) => bird.id === selectedId) || birds[0]

  return (
    <main className="bg-darkBlue text-white min-h-screen p-4 md:p-8">
      {initialLoading ? (
        <p>Loading birds data...</p>
      ) : (
        <div className="flex flex-col gap-4 w-full max-w-7xl mx-auto h-[95vh]">
          <FilterBar
            onSortChange={handleSort}
            onDateRangeChange={handleDateRange}
            onSearch={handleSearch}
          />
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 min-h-0 flex-1">
            {selectedBird && (
              <div className="flex-1 order-1 md:order-2">
                <InfoCard selectedItem={selectedBird} selectedId={selectedId} />
              </div>
            )}
            <div className="h-[25vh] md:h-auto md:w-80 order-2 md:order-1">
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
        </div>
      )}
    </main>
  )
}
