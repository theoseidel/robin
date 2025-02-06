import { NextResponse } from "next/server"

// Simple rate limiter
let lastRequestTime = 0
const RATE_LIMIT_MS = 1000 // 1 second

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sciName = searchParams.get('query')

  // Rate limiting
  const now = Date.now()
  if (now - lastRequestTime < RATE_LIMIT_MS) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please wait.' },
      { status: 429 }
    )
  }
  lastRequestTime = now

  try {
    // Build query: scientific name + high quality recordings only
    const query = `${sciName} q:A`
    const response = await fetch(
      `https://xeno-canto.org/api/2/recordings?query=${encodeURIComponent(query)}`
    )
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching from xeno-canto:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recordings' },
      { status: 500 }
    )
  }
} 