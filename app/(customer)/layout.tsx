import { SidebarProvider } from "@/components/ui/sidebar"
import { CustomerSidebar } from "@/components/customer/customer-sidebar"
import { CustomerHeader } from "@/components/customer/customer-header"
import { createClient } from "@/lib/supabase/server"
import { getAuthUser } from "@/lib/services/auth/auth.service"
import { redirect } from "next/navigation"

export default async function CustomerLayout({
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

  // Ensure user is customer
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'customer') {
    if (profile?.role === 'admin') redirect('/admin/dashboard')
    if (profile?.role === 'rider') redirect('/rider/dashboard')
    redirect('/login')
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-transparent w-full">
        <CustomerSidebar />
        <div className="flex w-full flex-col">
          <CustomerHeader />
          <main className="flex-1 p-6 md:p-8 overflow-y-auto">
            <div className="mx-auto max-w-6xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
