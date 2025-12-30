import type React from "react"
import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

export const metadata: Metadata = {
  title: "ClinicAI - Klinikler için AI Destekli Hasta Yönetim Platformu",
  description:
    "WhatsApp üzerinden 7/24 hasta danışmanlığı, AI fotoğraf analizi, otomatik fiyatlandırma ve randevu yönetimi. Saç ekimi klinikleri için AI otomasyon platformu.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/logos/cliniolabs-favicon.svg",
        type: "image/svg+xml",
      },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: "#059669",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
