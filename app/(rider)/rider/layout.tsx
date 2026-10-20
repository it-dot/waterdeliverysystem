import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { RiderSidebar } from "@/components/rider/rider-sidebar"
import { RiderHeader } from "@/components/rider/rider-header"
import { TooltipProvider } from "@/components/ui/tooltip"
import { createClient } from "@/lib/supabase/server"
import { getAuthUser } from "@/lib/services/auth/auth.service"

export const metadata: Metadata = {
  title: "Rider | Clearwell",
  description: "Clearwell water delivery rider app",
}

export default async function RiderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authRes = await getAuthUser()
  const user = authRes.data?.user

  if (!user) {
    redirect('/login')
  }

  const supabase = await createClient()

  let profile = { full_name: 'Rider' }

  const { data } = await supabase.from('profiles').select('full_name, role').eq('id', user.id).single()

  if (data?.role !== 'rider') {
    if (data?.role === 'customer') redirect('/customer/dashboard')
    if (data?.role === 'admin') redirect('/admin/dashboard')
    redirect('/login')
  }

  if (data) {
    profile = data
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <RiderSidebar />
        <SidebarInset>
          <RiderHeader profile={profile} />
          <div className="flex-1 overflow-auto p-4 md:p-6 bg-transparent">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
