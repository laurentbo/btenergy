import type { Metadata, Viewport } from "next"
import { AuthProvider } from "@/lib/auth-context"
import "./globals.css"

export const viewport: Viewport = {
  themeColor: "#15130E",
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
    <html lang="fr" className="h-full">
      <body className="min-h-full flex flex-col" style={{ background: "var(--bg)" }}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
