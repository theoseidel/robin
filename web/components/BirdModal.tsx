import { useCallback, useEffect, useState } from "react"
import {
  LiveKitRoom,
  VoiceAssistantControlBar,
  AgentState,
  RoomAudioRenderer,
  useVoiceAssistant,
  BarVisualizer,
  DisconnectButton,
} from "@livekit/components-react"
import { MediaDeviceFailure } from "livekit-client"
import { CloseIcon } from "@/components/CloseIcon"
import { NoAgentNotification } from "./NoAgentNotification"

interface Bird {
  imageUrl?: string
  name: string
  sciName: string
  lat: number
  lng: number
  dateTime: string
  family: string
  order: string
}

interface ModalProps {
  bird: Bird | null
  onClose: () => void
}

export default function BirdModal({ bird, onClose }: ModalProps) {
  const [connectionDetails, updateConnectionDetails] = useState<{
    participantToken: string
    serverUrl: string
  } | null>(null)
  const [agentState, setAgentState] = useState<AgentState>("disconnected")

  useEffect(() => {
    // Disable scroll when modal is open
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  const handleClose = useCallback(() => {
    updateConnectionDetails(null)
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!bird) return
    const fetchConnectionDetails = async () => {
      try {
        const response = await fetch("/api/connection-details")
        updateConnectionDetails(await response.json())
      } catch (error) {
        console.error("Error fetching LiveKit connection details:", error)
      }
    }
    fetchConnectionDetails()
  }, [bird])

  if (!bird) return null

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 transition-all ease-in-out duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
    >
      <div className="w-[90%] h-[90%] max-w-4xl bg-white text-black flex flex-col relative rounded-lg overflow-hidden shadow-lg">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 text-4xl"
        >
          ×
        </button>

        {/* Image Section */}
        <div className="w-full h-[45%] bg-gray-800 flex items-center justify-center">
          {bird.imageUrl ? (
            <img
              src={bird.imageUrl}
              alt={bird.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <p className="text-gray-400 text-lg">No Image Available</p>
          )}
        </div>

        {/* Bird Info */}
        <div className="flex-1 p-6 text-center flex flex-col justify-between">
          <h2 className="text-3xl font-semibold truncate">{bird.name}</h2>
          <p className="text-lg text-gray-600 mt-2 italic">{bird.family}</p>
          <p className="text-lg mt-2">Order: {bird.order}</p>
        </div>

        {/* LiveKit Room */}
        <LiveKitRoom
          token={connectionDetails?.participantToken}
          serverUrl={connectionDetails?.serverUrl}
          connect={!!connectionDetails}
          audio={true}
          video={false}
          onMediaDeviceFailure={onDeviceFailure}
          onDisconnected={handleClose}
          className="flex-1 flex flex-col justify-between bg-gray-700 p-4 rounded-b-lg"
        >
          <SimpleVoiceAssistant onStateChange={setAgentState} />
          <VoiceAssistantControlBar controls={{ leave: false }} />
          <RoomAudioRenderer />
          <DisconnectButton>
            <CloseIcon />
          </DisconnectButton>
          <NoAgentNotification state={agentState} />
        </LiveKitRoom>
      </div>
    </div>
  )
}

function SimpleVoiceAssistant({
  onStateChange,
}: {
  onStateChange: (state: AgentState) => void
}) {
  const { state, audioTrack } = useVoiceAssistant()
  useEffect(() => {
    onStateChange(state)
  }, [onStateChange, state])

  return (
    <div className="h-[80px] max-w-[90%] mx-auto mb-4">
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

function onDeviceFailure(error?: MediaDeviceFailure) {
  console.error(error)
  alert(
    "Error acquiring microphone permissions. Please ensure your browser has granted the necessary permissions and reload the tab."
  )
}
