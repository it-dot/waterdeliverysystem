'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ShoppingCart, Receipt, User, LogOut, Droplets } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { logout } from "@/lib/actions/auth"

export function CustomerSidebar() {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Dashboard",
      href: "/customer/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "My Orders",
      href: "/customer/orders",
      icon: ShoppingCart,
    },
    {
      title: "Invoices",
      href: "/customer/invoices",
      icon: Receipt,
    },
    {
      title: "Profile & Address",
      href: "/customer/profile",
      icon: User,
    }
  ]

  return (
    <Sidebar className="border-r border-border/80 bg-sidebar">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <Link href="/customer/dashboard" className="flex items-center gap-3 px-2 group">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
            <Droplets className="size-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-foreground">Clearwell</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-primary/15 text-primary">PORTAL</span>
            </div>
            <span className="text-[11px] text-muted-foreground">Water Delivery</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          Navigation
        </div>
        <SidebarMenu className="gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/customer/dashboard" && pathname.startsWith(item.href + "/"))
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  render={<Link href={item.href} />}
                  isActive={isActive}
                  className={`transition-colors rounded-lg ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold dark:bg-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5 px-2 py-1.5 w-full">
                    <item.icon className="size-4" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <form action={logout}>
              <SidebarMenuButton
                onClick={(e) => {
                  e.currentTarget.closest('form')?.requestSubmit()
                }}
                className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors rounded-lg"
              >
                <div className="flex items-center gap-2.5 px-2 py-1.5">
                  <LogOut className="size-4" />
                  <span className="text-sm font-medium">Logout</span>
                </div>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
