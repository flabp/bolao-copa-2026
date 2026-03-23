import type { Metadata } from "next"
import { Inter, Barlow } from "next/font/google"
import "./globals.css"
import { AuthGate } from "@/components/auth/auth-gate"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: "Bolao Copa 2026",
  description: "Bolao de palpites para a Copa do Mundo FIFA 2026",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${barlow.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background">
        <AuthGate>{children}</AuthGate>
      </body>
    </html>
  )
}
