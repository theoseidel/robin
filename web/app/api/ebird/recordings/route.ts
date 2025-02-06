import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sciName = searchParams.get('query')

  if (!sciName) {
    return NextResponse.json({ error: 'Scientific name is required' }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://api.ebird.org/v2/data/recordings/${sciName}`,
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
      { error: 'Failed to fetch recordings' },
      { status: 500 }
    )
  }
} 