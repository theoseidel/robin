import { useState, useEffect } from "react"
import { Bird } from "../types"
import { getWikimediaImage } from "../lib/imageCache"
import { ITEMS_PER_PAGE } from "../lib/constants"
export function useBirds() {
  const [birds, setBirds] = useState<Bird[]>([]) // Currently displayed birds
  const [allBirds, setAllBirds] = useState<Bird[]>([]) // Original dataset
  const [filteredBirds, setFilteredBirds] = useState<Bird[]>([]) // Filtered dataset
  const [initialLoading, setInitialLoading] = useState(true)
  const [imagesLoading, setImagesLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)

  // Initial data fetch
  useEffect(() => {
    async function fetchBirds() {
      try {
        const response = await fetch("/api/birds")
        if (!response.ok) throw new Error("Failed to fetch birds")
        const data = await response.json()
        
        setAllBirds(data)
        setFilteredBirds(data)
        
        const initialBirds = data.slice(0, ITEMS_PER_PAGE)
        setBirds(initialBirds)
        setHasMore(data.length > ITEMS_PER_PAGE)
        
        // Load images for initial birds
        await loadImagesForBirds(initialBirds)
      } catch (error) {
        console.error("Error fetching birds:", error)
        setError(error instanceof Error ? error.message : "Failed to fetch birds")
      } finally {
        setInitialLoading(false)
      }
    }

    fetchBirds()
  }, [])

  // Helper function to load images
  const loadImagesForBirds = async (birdsToLoad: Bird[]) => {
    setImagesLoading(true)
    try {
      await Promise.all(
        birdsToLoad.map(async (bird) => {
          if (!bird.imageUrl) {
            const imageUrl = await getWikimediaImage(bird.sciName)
            bird.imageUrl = imageUrl
          }
        })
      )
    } catch (error) {
      console.error("Error loading images:", error)
    } finally {
      setImagesLoading(false)
    }
  }

  // Load more birds
  const loadMore = async () => {
    if (!imagesLoading && hasMore) {
      setImagesLoading(true)
      const nextBirds = filteredBirds.slice(
        birds.length,
        birds.length + ITEMS_PER_PAGE
      )
      setBirds((current) => [...current, ...nextBirds])
      setHasMore(birds.length + nextBirds.length < filteredBirds.length)
      await loadImagesForBirds(nextBirds)
    }
  }

  // Filter functions
  const filterByDateRange = (range: { start: string; end: string }) => {
    const { start, end } = range
    if (!start && !end) {
      setFilteredBirds(allBirds)
      setBirds(allBirds.slice(0, ITEMS_PER_PAGE))
      setHasMore(allBirds.length > ITEMS_PER_PAGE)
      return
    }

    const filtered = allBirds.filter((bird) => {
      const birdDate = new Date(bird.dateTime).getTime()
      const startDate = start ? new Date(start).getTime() : 0
      const endDate = end ? new Date(end).getTime() : Infinity
      return birdDate >= startDate && birdDate <= endDate
    })

    setFilteredBirds(filtered)
    setBirds(filtered.slice(0, ITEMS_PER_PAGE))
    setHasMore(filtered.length > ITEMS_PER_PAGE)
  }

  const filterBySearch = (query: string) => {
    if (!query) {
      setFilteredBirds(allBirds)
      setBirds(allBirds.slice(0, ITEMS_PER_PAGE))
      setHasMore(allBirds.length > ITEMS_PER_PAGE)
      return
    }

    const filtered = allBirds.filter(
      (bird) =>
        bird.name.toLowerCase().includes(query.toLowerCase()) ||
        bird.sciName.toLowerCase().includes(query.toLowerCase())
    )

    setFilteredBirds(filtered)
    setBirds(filtered.slice(0, ITEMS_PER_PAGE))
    setHasMore(filtered.length > ITEMS_PER_PAGE)
  }

  const filterBySort = (direction: "asc" | "desc") => {
    const sorted = [...filteredBirds].sort((a, b) => {
      return direction === "asc" 
        ? new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
        : new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
    })
    setBirds(sorted.slice(0, ITEMS_PER_PAGE))
    setFilteredBirds(sorted)
  }

  return {
    birds,
    initialLoading,
    imagesLoading,
    error,
    hasMore,
    loadMore,
    filterByDateRange,
    filterBySearch,
    filterBySort,
  }
} 