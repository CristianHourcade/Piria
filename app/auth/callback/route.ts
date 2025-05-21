import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  console.log("🔄 Auth callback route triggered")

  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  console.log("🔑 Auth code present:", !!code)

  if (code) {
    const cookieStore = cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: "", ...options })
          },
        },
      },
    )

    console.log("🔌 Server-side Supabase client initialized in callback")

    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("❌ Error exchanging code for session:", error.message)
        return NextResponse.redirect(`${requestUrl.origin}/login?error=Could not authenticate user`)
      }

      console.log("✅ Successfully exchanged code for session")
      return NextResponse.redirect(`${requestUrl.origin}/admin/dashboard`)
    } catch (error) {
      console.error("❌ Unexpected error in auth callback:", error)
      return NextResponse.redirect(`${requestUrl.origin}/login?error=Unexpected authentication error`)
    }
  }

  console.log("⚠️ No code found in callback URL")
  return NextResponse.redirect(`${requestUrl.origin}/login?error=No code provided`)
}
