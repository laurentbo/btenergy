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

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // Routes publiques
  const publicApis = ["/api/verify-company", "/api/send-magic-link", "/api/send-reset-password"]
  if (pathname.startsWith("/login") || pathname.startsWith("/auth") || pathname.startsWith("/email-preview") || publicApis.includes(pathname)) {
    if (user) return NextResponse.redirect(new URL("/", request.url))
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
