import type { Metadata, Viewport } from "next"
import { Baloo_2, Hanken_Grotesk } from "next/font/google"
import { AuthProvider } from "@/lib/auth-context"
import "./globals.css"

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
})

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
})

export const viewport: Viewport = {
  themeColor: "#EDFAF4",
}

export const metadata: Metadata = {
  title: "Back to Energy",
  description: "Programme de coaching nutritionnel 21 jours — méthode Verissimo.",
  appleWebApp: {
    capable: true,
    title: "Back to Energy",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "Back to Energy",
    description: "Programme de coaching nutritionnel 21 jours — méthode Verissimo.",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`h-full ${baloo.variable} ${hanken.variable}`}>
      <body className="min-h-full flex flex-col" style={{ background: "var(--bg)" }}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
