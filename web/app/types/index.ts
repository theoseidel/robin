export type Bird = {
  id: number
  name: string
  sciName: string
  speciesCode: string
  dateTime: string
  lat: number
  lng: number
  url: string
  imageUrl?: string
}

export type BirdInfo = {
  speciesCode: string
  order: string
  family: string
  bandingCodes: string[]
}

export type AgentState =
  | "disconnected"
  | "connecting"
  | "speaking"
  | "listening"
  | "processing"
  | "no_agent"
  | "initializing"
  | "connected"
  | "error" 