export const imageCache = new Map<string, string>()

export async function getWikimediaImage(sciName: string): Promise<string> {
  if (imageCache.has(sciName)) {
    return imageCache.get(sciName)!
  }

  try {
    const searchQuery = encodeURIComponent(sciName)
    const response = await fetch(
      `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${searchQuery}&format=json&origin=*&srnamespace=6`
    )
    const data = await response.json()

    const imageUrl = data.query?.search?.[0]
      ? `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
          data.query.search[0].title
        )}`
      : "/placeholder-bird.jpg"

    imageCache.set(sciName, imageUrl)
    return imageUrl
  } catch (error) {
    console.error("Error fetching Wikimedia image:", error)
    return "/placeholder-bird.jpg"
  }
} 