import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  console.log("🛡️ Middleware triggered for path:", request.nextUrl.pathname)

  if (!request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.startsWith("/colaborador")) {
    console.log("🔓 Not a protected route, skipping auth check")
    return NextResponse.next()
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-url", request.url)

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          response.cookies.set({ name, value: "", ...options })
        },
      },
    },
  )

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      console.log("❌ No session found, redirecting to login")
      return NextResponse.redirect(new URL("/login", request.url))
    }

    const authId = session.user.id

    // Obtener el rol desde la tabla users
    const { data: userData, error } = await supabase
      .from("users")
      .select("role")
      .eq("auth_id", authId)
      .single()

    const userRole = userData?.role || "colaborador"
    console.log("👤 User role (from table):", userRole)

    if (request.nextUrl.pathname.startsWith("/admin") && userRole !== "admin") {
      console.log("🚫 User does not have admin role, redirecting")
      return NextResponse.redirect(new URL("/colaborador/tareas", request.url))
    }

    if (request.nextUrl.pathname.startsWith("/colaborador") && userRole !== "colaborador" && userRole !== "admin") {
      console.log("🚫 User does not have required role, redirecting")
      return NextResponse.redirect(new URL("/login", request.url))
    }

    return response
  } catch (error) {
    console.error("❌ Error in auth middleware:", error)
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|auth|login).*)",
  ],
}
