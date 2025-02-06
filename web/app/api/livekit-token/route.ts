import { AccessToken } from "livekit-server-sdk"
import { NextResponse } from "next/server"

export async function GET() {
  const apiKey = process.env.LIVEKIT_API_KEY!
  const apiSecret = process.env.LIVEKIT_API_SECRET!
  
  const at = new AccessToken(apiKey, apiSecret, {
    identity: "bird-chat-user",
  })

  at.addGrant({ room: "bird-chat", roomJoin: true })

  return NextResponse.json({ token: at.toJwt() })
} 