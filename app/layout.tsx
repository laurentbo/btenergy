import type { Metadata } from "next"
import { AuthProvider } from "@/lib/auth-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "Back to Energy — Programme 21 Jours",
  description: "Détox, énergie et vitalité — programme de 21 jours",
  themeColor: "#16a34a",
  appleWebApp: {
    capable: true,
    title: "Back to Energy",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "Back to Energy",
    description: "Programme de 21 jours — énergie & vitalité",
    type: "website",
  },
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
