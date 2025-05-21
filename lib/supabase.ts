import { createBrowserClient } from "@supabase/ssr"

// Log the environment variables (without showing the actual values)
console.log("🔧 Supabase URL configured:", !!process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log("🔧 Supabase Anon Key configured:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

console.log("🔌 Supabase client initialized")

// Add typed table interfaces for better type safety
export type Tables = {
  clients: {
    id: number
    name: string
    company: string
    email: string | null
    phone: string | null
    instagram_link: string | null
    facebook_link: string | null
    website_link: string | null
    canva_link: string | null
    drive_link: string | null
    payment_day: number
    status: string
    comments: string | null
    total: number
    billing_cycle: string | null
    payment_method: string | null
    payment_status: string
    renewal_type: string | null
    renewal_date: string | null
    auto_renewal: boolean
    cuil: string | null
    condicion_fiscal: string | null
    birth_date: string | null
    created_at: string
    updated_at: string
  }
  projects: {
    id: number
    name: string
    client_id: number
    service: string
    status: string
    progress: number
    start_date: string
    end_date: string
    last_update: string
    responsible: string
    description: string
    budget: number
    cost: number
    created_at: string
    updated_at: string
  }
  tasks: {
    id: number
    title: string
    project_id: number | null
    client_id: number | null
    service: string | null
    assignee_id: number | null
    due_date: string
    status: string
    priority: string
    description: string | null
    created_at: string
    updated_at: string
  }
  // Add other table types as needed
}
