import { useState, useEffect } from "react"
import {
  LiveKitRoom,
  VoiceAssistantControlBar,
  RoomAudioRenderer,
  useVoiceAssistant,
  BarVisualizer,
} from "@livekit/components-react"
import { Tooltip } from "./Tooltip"

type AgentState =
  | "disconnected"
  | "connecting"
  | "speaking"
  | "listening"
  | "processing"
  | "no_agent"
  | "initializing"
  | "connected"
  | "error"

interface BirdChatProps {
  sciName: string
  birdName: string
  additionalInfo?: {
    order?: string
    family?: string
    location?: string
    sightingDate?: string
  }
}

export default function BirdChat({
  sciName,
  birdName,
  additionalInfo,
}: BirdChatProps) {
  const [connectionDetails, setConnectionDetails] = useState<{
    participantToken: string
    serverUrl: string
  } | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchConnectionDetails = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/connection-details")
        if (!response.ok) throw new Error("Failed to connect")
        setConnectionDetails(await response.json())
        setError(null)
      } catch (error) {
        setError("Failed to connect to voice service")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchConnectionDetails()
  }, [])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "m" && e.ctrlKey) {
        setIsActive((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [])

  if (error) {
    return (
      <div className="bg-red-500/10 text-red-400 rounded-lg p-4 text-sm">
        {error}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    )
  }

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 h-full flex flex-col">
      <div className="flex justify-between items-center shrink-0 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-sm font-medium text-gray-300">Bird Assistant</h3>
        </div>
        <button
          onClick={() => setIsActive(!isActive)}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
            isActive
              ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30"
              : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30"
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {isActive ? "Stop" : "Start"}
            <span className="text-xs text-gray-400">(Ctrl+M)</span>
          </span>
        </button>
      </div>

      <div className="flex-1 min-h-0">
        {isActive ? (
          <LiveKitRoom
            token={connectionDetails?.participantToken}
            serverUrl={connectionDetails?.serverUrl}
            connect={!!connectionDetails}
            audio={true}
            video={false}
            onMediaDeviceFailure={onDeviceFailure}
            className="h-full"
            options={{
              audioCaptureDefaults: {
                noiseSuppression: true,
                echoCancellation: true,
                autoGainControl: true,
              },
            }}
          >
            <SimpleVoiceAssistant />
            <RoomAudioRenderer />
          </LiveKitRoom>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            <p>Click Start to ask about {birdName}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function SimpleVoiceAssistant() {
  const { state, audioTrack } = useVoiceAssistant()

  return (
    <div className="flex items-center justify-between gap-4 h-full px-4">
      <div className="h-16 flex-1">
        <BarVisualizer
          state={state}
          barCount={6}
          trackRef={audioTrack}
          className="h-full w-full"
          options={{
            minHeight: 24,
          }}
        />
      </div>
      <Tooltip content="Toggle microphone">
        <VoiceAssistantControlBar
          controls={{ leave: false }}
          className="bg-gray-900/50 rounded-lg border border-gray-700/50 p-1"
        />
      </Tooltip>
    </div>
  )
}

function onDeviceFailure() {
  alert(
    "Error acquiring microphone permissions. Please ensure your browser has granted the necessary permissions and reload the tab."
  )
}
