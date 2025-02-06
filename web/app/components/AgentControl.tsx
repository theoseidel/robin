import { useCallback, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  useVoiceAssistant,
  BarVisualizer,
  VoiceAssistantControlBar,
  AgentState,
  DisconnectButton,
} from "@livekit/components-react"
import { useKrispNoiseFilter } from "@livekit/components-react/krisp"

export default function AgentControl() {
  const [agentState, setAgentState] = useState<AgentState>("disconnected")
  const { state, audioTrack } = useVoiceAssistant()
  const krisp = useKrispNoiseFilter()

  useEffect(() => {
    setAgentState(state)
    krisp.setNoiseFilterEnabled(true)
  }, [state, krisp])

  const onConnectButtonClicked = useCallback(async () => {
    const url = new URL(
      process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ??
        "/api/connection-details",
      window.location.origin
    )
    const response = await fetch(url.toString())
    const connectionDetailsData = await response.json()
    return connectionDetailsData
  }, [])

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="h-[300px]">
        <BarVisualizer
          state={state}
          barCount={5}
          trackRef={audioTrack}
          className="agent-visualizer"
          options={{ minHeight: 24 }}
        />
      </div>

      <div className="relative h-[100px]">
        <AnimatePresence>
          {agentState === "disconnected" && (
            <motion.button
              initial={{ opacity: 0, top: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, top: "-10px" }}
              transition={{ duration: 1, ease: [0.09, 1.04, 0.245, 1.055] }}
              className="uppercase absolute left-1/2 -translate-x-1/2 px-4 py-2 bg-white text-black rounded-md"
              onClick={onConnectButtonClicked}
            >
              Start a conversation
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {agentState !== "disconnected" && agentState !== "connecting" && (
            <motion.div
              initial={{ opacity: 0, top: "10px" }}
              animate={{ opacity: 1, top: 0 }}
              exit={{ opacity: 0, top: "-10px" }}
              transition={{ duration: 0.4, ease: [0.09, 1.04, 0.245, 1.055] }}
              className="flex h-8 absolute left-1/2 -translate-x-1/2 justify-center"
            >
              <VoiceAssistantControlBar controls={{ leave: false }} />
              <DisconnectButton>
                <span className="sr-only">Disconnect</span>
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </DisconnectButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
