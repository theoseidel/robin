import { useState, useEffect } from "react"
import type { BirdInfo } from "@/types"

export function useBirdInfo(sciName: string) {
  const [birdInfo, setBirdInfo] = useState<BirdInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBirdInfo = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(
          `/api/ebird/species-code/${encodeURIComponent(sciName)}`
        )
        const data = await response.json()
        setBirdInfo(data)
        setError(null)
      } catch (error) {
        console.error("Error fetching bird info:", error)
        setError("Failed to fetch bird information")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBirdInfo()
  }, [sciName])

  return { birdInfo, isLoading, error }
} 