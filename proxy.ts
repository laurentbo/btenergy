import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    // Supabase indisponible — on traite comme non-authentifié
  }

  const { pathname } = request.nextUrl

  // Intercepte les codes PKCE/token_hash Supabase qui atterrissent n'importe où
  // (Supabase dashboard "Send" redirige vers Site URL, pas /auth/callback)
  const code      = request.nextUrl.searchParams.get("code")
  const tokenHash = request.nextUrl.searchParams.get("token_hash")
  if ((code || tokenHash) && !pathname.startsWith("/auth")) {
    const callbackUrl = new URL("/auth/callback", request.url)
    if (code)      callbackUrl.searchParams.set("code", code)
    if (tokenHash) callbackUrl.searchParams.set("token_hash", tokenHash)
    const type = request.nextUrl.searchParams.get("type")
    if (type) callbackUrl.searchParams.set("type", type)
    return NextResponse.redirect(callbackUrl)
  }

  // APIs publiques : jamais de redirect, toujours passer
  const publicApis = ["/api/verify-company", "/api/send-magic-link", "/api/send-reset-password"]
  if (publicApis.includes(pathname)) return supabaseResponse

  // Pages publiques : redirect vers / si déjà connecté
  if (pathname.startsWith("/login") || pathname.startsWith("/auth") || pathname.startsWith("/email-preview")) {
    if (user && pathname !== "/auth/reset-password") return NextResponse.redirect(new URL("/", request.url))
    return supabaseResponse
  }

  // Route coach protégée
  if (pathname.startsWith("/coach")) {
    if (!user) return NextResponse.redirect(new URL("/login/coach", request.url))
    // Utilise service_role pour bypass RLS lors de la vérification du rôle
    const admin = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { cookies: { getAll: () => [], setAll: () => {} } }
    )
    const { data: profile } = await admin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle()
    if (profile?.role !== "coach" && profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url))
    }
    return supabaseResponse
  }

  // App principale : auth requise
  if (!user) return NextResponse.redirect(new URL("/login", request.url))

  return supabaseResponse
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|html)$).*)"],
}
