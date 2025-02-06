import { useEffect, useRef, useState } from "react"
import WaveSurfer from "wavesurfer.js"

interface Recording {
  url: string
  rating: number
  recordist: string
  type: string
}

export default function WaveformPlayer({ sciName }: { sciName: string }) {
  const waveformRef = useRef<HTMLDivElement>(null)
  const wavesurfer = useRef<WaveSurfer | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(
    null
  )

  useEffect(() => {
    const fetchRecordings = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(
          `/api/ebird/recordings?query=${encodeURIComponent(sciName)}`
        )
        if (!response.ok) {
          throw new Error("Failed to fetch recordings")
        }
        const data = await response.json()

        if (data && data.length > 0) {
          setRecordings(data)
          setSelectedRecording(data[0])
          wavesurfer.current?.load(data[0].url)
        } else {
          setError("No recordings found")
        }
      } catch (err) {
        setError("Failed to load audio")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    if (sciName) {
      fetchRecordings()
    }
  }, [sciName])

  useEffect(() => {
    if (waveformRef.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#4B5563",
        progressColor: "#3B82F6",
        cursorColor: "#60A5FA",
        barWidth: 2,
        barGap: 1,
        height: 60,
        barRadius: 3,
        normalize: true,
        backend: "WebAudio",
      })

      wavesurfer.current.on("play", () => setIsPlaying(true))
      wavesurfer.current.on("pause", () => setIsPlaying(false))
      wavesurfer.current.on("finish", () => setIsPlaying(false))

      return () => {
        wavesurfer.current?.destroy()
      }
    }
  }, [])

  const togglePlayPause = () => {
    wavesurfer.current?.playPause()
  }

  return (
    <div className="bg-gray-800/50 rounded-lg p-4">
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlayPause}
          disabled={isLoading || !!error}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
            isLoading || error
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isLoading ? (
            <span className="animate-spin">⟳</span>
          ) : error ? (
            <span>⚠️</span>
          ) : isPlaying ? (
            <span>⏸</span>
          ) : (
            <span>▶️</span>
          )}
        </button>
        <div className="flex-1">
          {error ? (
            <p className="text-red-400 text-sm">{error}</p>
          ) : (
            <div ref={waveformRef} />
          )}
        </div>
      </div>
    </div>
  )
}
