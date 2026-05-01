import type { Metadata } from "next"
import { AuthProvider } from "@/lib/auth-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "Backtoenergy — Programme 21 Jours",
  description: "Détox, énergie et vitalité pour les collaborateurs",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full flex flex-col" style={{ background: "var(--bg-primary)" }}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
