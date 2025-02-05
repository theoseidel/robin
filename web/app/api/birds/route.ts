import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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