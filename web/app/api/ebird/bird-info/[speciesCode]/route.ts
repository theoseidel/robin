import { NextResponse } from "next/server"

export async function GET(
  _request: Request,
  { params }: { params: { speciesCode: string } }
) {
  try {
    const response = await fetch(
      `https://api.ebird.org/v2/ref/taxonomy/ebird/find/${params.speciesCode}`,
      {
        headers: {
          'X-eBirdApiToken': process.env.NEXT_PUBLIC_EBIRD_API_KEY!
        }
      }
    )
    const data = await response.json()
    const birdInfo = data[0] || null
    
    return NextResponse.json({ 
      order: birdInfo?.order || "Unknown",
      family: birdInfo?.familyComName || "Unknown",
      bandingCodes: birdInfo?.bandingCodes || [],
    })
  } catch (error) {
    return NextResponse.json({ 
      order: "Unknown",
      family: "Unknown",
      bandingCodes: [],
    })
  }
} 