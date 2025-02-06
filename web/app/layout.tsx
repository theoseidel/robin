import "@livekit/components-styles"
import "./globals.css"
import { Public_Sans } from "next/font/google"
import "mapbox-gl/dist/mapbox-gl.css"

const publicSans400 = Public_Sans({
  weight: "400",
  subsets: ["latin"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`h-full ${publicSans400.className}`}>
      <body className="h-full bg-darkBlue text-white">{children}</body>
    </html>
  )
}
