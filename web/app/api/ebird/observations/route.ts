import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const speciesCode = searchParams.get('speciesCode')
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')

  if (!speciesCode || !lat || !lng) {
    return NextResponse.json(
      { error: 'Species code and coordinates are required' },
      { status: 400 }
    )
  }

  try {
    // Get observations within 50km of the location from the last 30 days
    const response = await fetch(
      `https://api.ebird.org/v2/data/obs/geo/recent/${speciesCode}?lat=${lat}&lng=${lng}&dist=50&back=30`,
      {
        headers: {
          'X-eBirdApiToken': process.env.NEXT_PUBLIC_EBIRD_API_KEY!
        }
      }
    )

    if (!response.ok) {
      throw new Error(`eBird API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching from eBird:', error)
    return NextResponse.json(
      { error: 'Failed to fetch observations' },
      { status: 500 }
    )
  }
} 