import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Cache for species codes
const speciesCodeCache = new Map<string, string>();

async function getSpeciesCodesInBatches(birds: any[]) {
  const uniqueSciNames = [...new Set(birds.map(bird => bird.sciName))];
  const batchSize = 4; // Process 4 species at a time
  const results = new Map<string, string>();

  for (let i = 0; i < uniqueSciNames.length; i += batchSize) {
    const batch = uniqueSciNames.slice(i, i + batchSize);
    const batchPromises = batch.map(async (sciName) => {
      if (speciesCodeCache.has(sciName)) {
        return [sciName, speciesCodeCache.get(sciName)];
      }

      try {
        const response = await fetch(
          `https://api.ebird.org/v2/ref/taxonomy/ebird?fmt=json&sci=${encodeURIComponent(sciName)}`,
          {
            headers: {
              'X-eBirdApiToken': process.env.NEXT_PUBLIC_EBIRD_API_KEY!
            }
          }
        );
        const data = await response.json();
        const code = data[0]?.speciesCode || sciName.toLowerCase().replace(" ", "");
        speciesCodeCache.set(sciName, code);
        return [sciName, code];
      } catch (error) {
        const fallback = sciName.toLowerCase().replace(" ", "");
        speciesCodeCache.set(sciName, fallback);
        return [sciName, fallback];
      }
    });

    const batchResults = await Promise.all(batchPromises);
    batchResults.forEach(([sciName, code]) => results.set(sciName, code));
    
    // Add a small delay between batches to respect rate limits
    if (i + batchSize < uniqueSciNames.length) {
      await new Promise(resolve => setTimeout(resolve, 250));
    }
  }

  return birds.map(bird => ({
    ...bird,
    speciesCode: results.get(bird.sciName) || bird.sciName.toLowerCase().replace(" ", "")
  }));
}

export async function GET() {
  try {
    const { data, error } = await supabase.from("Bird").select("*");

    if (error) {
      console.error("❌ Supabase fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch birds" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}