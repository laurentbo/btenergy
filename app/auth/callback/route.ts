import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code       = searchParams.get("code")
  const token_hash = searchParams.get("token_hash")
  const type       = searchParams.get("type") ?? "magiclink"

  // Aucun paramètre exploitable côté serveur
  if (!code && !token_hash) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Collecte les cookies que Supabase veut poser
  const cookiesToSet: Array<{ name: string; value: string; options: Record<string, unknown> }> = []

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => { cookiesToSet.push(...cookies) },
      },
    }
  )

  let authError: { message: string } | null = null

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    authError = error
  } else if (token_hash) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabase.auth.verifyOtp({ token_hash, type: type as any })
    authError = error
  }

  // Echec d'auth → retour login avec message d'erreur
  if (authError) {
    const url = new URL("/login", request.url)
    url.searchParams.set("error", authError.message)
    return NextResponse.redirect(url)
  }

  // Mail de bienvenue (fire-and-forget, ne bloque pas)
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? "https://backtoenergy.fr"}/api/auth/welcome`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, email: user.email }),
      }).catch(() => {})
    }
  } catch {}

  // Destination finale
  const destination = type === "recovery" ? "/auth/reset-password" : "/"
  const response = NextResponse.redirect(new URL(destination, request.url))

  // Pose les cookies de session sur la réponse HTTP (visible par le proxy dès le prochain request)
  cookiesToSet.forEach(({ name, value, options }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response.cookies.set(name, value, options as any)
  })

  return response
}
