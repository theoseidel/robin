import { useState, useEffect } from "react"
import {
  LiveKitRoom,
  VoiceAssistantControlBar,
  RoomAudioRenderer,
  useVoiceAssistant,
  BarVisualizer,
} from "@livekit/components-react"

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
}

export default function BirdChat({ sciName, birdName }: BirdChatProps) {
  const [connectionDetails, setConnectionDetails] = useState<{
    participantToken: string
    serverUrl: string
  } | null>(null)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const fetchConnectionDetails = async () => {
      try {
        const response = await fetch("/api/connection-details")
        setConnectionDetails(await response.json())
      } catch (error) {
        console.error("Error fetching LiveKit connection details:", error)
      }
    }
    fetchConnectionDetails()
  }, [])

  return (
    <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-300">
          Ask about this bird
        </h3>
        <button
          onClick={() => setIsActive(!isActive)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive
              ? "bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30"
              : "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/30"
          }`}
        >
          {isActive ? "Stop Assistant" : "Start Assistant"}
        </button>
      </div>

      {isActive && (
        <LiveKitRoom
          token={connectionDetails?.participantToken}
          serverUrl={connectionDetails?.serverUrl}
          connect={!!connectionDetails}
          audio={true}
          video={false}
          onMediaDeviceFailure={onDeviceFailure}
          className="flex flex-col gap-4"
        >
          <SimpleVoiceAssistant />
          <div className="flex justify-center">
            <VoiceAssistantControlBar
              controls={{ leave: false }}
              className="bg-gray-800/50 rounded-lg border border-gray-700/50 p-1"
            />
          </div>
          <RoomAudioRenderer />
        </LiveKitRoom>
      )}
    </div>
  )
}

function SimpleVoiceAssistant() {
  const { state, audioTrack } = useVoiceAssistant()

  return (
    <div className="h-[80px] max-w-[90%] mx-auto">
      <BarVisualizer
        state={state}
        barCount={7}
        trackRef={audioTrack}
        className="agent-visualizer"
        options={{ minHeight: 24 }}
      />
    </div>
  )
}

function onDeviceFailure() {
  alert(
    "Error acquiring microphone permissions. Please ensure your browser has granted the necessary permissions and reload the tab."
  )
}
