import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { TooltipProvider } from "@/components/ui/tooltip"
import { getAuthUser } from "@/lib/services/auth/auth.service"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Admin | Clearwell",
  description: "Clearwell water delivery admin dashboard",
}

export default async function AdminLayout({
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

  const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  
  if (data?.role !== 'admin') {
    if (data?.role === 'customer') redirect('/customer/dashboard')
    if (data?.role === 'rider') redirect('/rider/dashboard')
    redirect('/login')
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <AdminHeader />
          <div className="flex-1 overflow-auto p-4 md:p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
