"use client"

import { AnimatePresence, motion } from "framer-motion"
import {
  LiveKitRoom,
  useVoiceAssistant,
  BarVisualizer,
  RoomAudioRenderer,
  VoiceAssistantControlBar,
  AgentState,
  DisconnectButton,
} from "@livekit/components-react"
import { useCallback, useEffect, useState } from "react"
import { MediaDeviceFailure } from "livekit-client"
import type { ConnectionDetails } from "./api/connection-details/route"
import { useKrispNoiseFilter } from "@livekit/components-react/krisp"
import Carousel from "../components/Carousel"
import BirdGrid from "@/components/BirdGrid"

const birdData = [
  { sciName: "Turdus migratorius", dateTime: "2024-02-02 09:15" },
  { sciName: "Cyanocitta cristata", dateTime: "2024-02-01 18:45" },
  { sciName: "Cardinalis cardinalis", dateTime: "2024-02-05 08:20" },
  { sciName: "Setophaga ruticilla", dateTime: "2024-02-04 17:55" },
  { sciName: "Baeolophus bicolor", dateTime: "2024-02-06 12:10" },
  { sciName: "Zonotrichia leucophrys", dateTime: "2024-02-03 21:30" },
  { sciName: "Sitta carolinensis", dateTime: "2024-02-07 07:45" },
  { sciName: "Spinus tristis", dateTime: "2024-02-06 16:10" },
  { sciName: "Baeolophus bicolor", dateTime: "2024-02-06 12:10" },
  { sciName: "Zonotrichia leucophrys", dateTime: "2024-02-03 21:30" },
  { sciName: "Spinus tristis", dateTime: "2024-02-06 16:10" },
]

export default function Page() {
  const [connectionDetails, updateConnectionDetails] = useState<
    ConnectionDetails | undefined
  >(undefined)
  const [agentState, setAgentState] = useState<AgentState>("disconnected")

  const onConnectButtonClicked = useCallback(async () => {
    const url = new URL(
      process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ??
        "/api/connection-details",
      window.location.origin
    )
    const response = await fetch(url.toString())
    const connectionDetailsData = await response.json()
    updateConnectionDetails(connectionDetailsData)
  }, [])

  return (
    <main className="bg-darkBlue text-white min-h-screen">
      <LiveKitRoom
        token={connectionDetails?.participantToken}
        serverUrl={connectionDetails?.serverUrl}
        connect={connectionDetails !== undefined}
        audio={true}
        video={false}
        onMediaDeviceFailure={onDeviceFailure}
        onDisconnected={() => {
          updateConnectionDetails(undefined)
        }}
        className="grid grid-rows-[2fr_1fr] items-center"
      />
      <div className="h-screen flex-col items-center justify-end bg-darkBlue p-10 gap-5">
        <div className="h-[50px]">heading</div>
        <BirdGrid birds={birdData}></BirdGrid>
      </div>
    </main>
  )
}

function onDeviceFailure(error?: MediaDeviceFailure) {
  console.error(error)
  alert(
    "Error acquiring camera or microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab"
  )
}
