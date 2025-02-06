import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { sciName: string } }
) {
  const sciName = await Promise.resolve(params.sciName)

  try {
    const response = await fetch(
      `https://api.ebird.org/v2/ref/taxonomy/ebird?fmt=json&sci=${encodeURIComponent(sciName)}`,
      {
        headers: {
          'X-eBirdApiToken': process.env.NEXT_PUBLIC_EBIRD_API_KEY!
        }
      }
    )
    const data = await response.json()
    const birdInfo = data[0] || null
    
    return NextResponse.json({ 
      speciesCode: birdInfo?.speciesCode || sciName.toLowerCase().replace(" ", ""),
      order: birdInfo?.order || "Unknown",
      family: birdInfo?.familyComName || "Unknown",
      category: birdInfo?.category || "Unknown",
      bandingCodes: birdInfo?.bandingCodes || [],
    })
  } catch (error) {
    return NextResponse.json({ 
      speciesCode: sciName.toLowerCase().replace(" ", ""),
      order: "Unknown",
      family: "Unknown",
      category: "Unknown",
      bandingCodes: [],
    })
  }
} 