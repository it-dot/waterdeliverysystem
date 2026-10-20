"use client"

import { logout } from "@/lib/actions/auth"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ClipboardList,
  Truck,
  Calendar,
  Package,
  Users,
  CreditCard,
  Receipt,
  BarChart3,
  Droplets,
  LogOut,
  UserCircle,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"

const mainNav = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
]

const operationsNav = [
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ClipboardList,
  },
  {
    title: "Deliveries",
    href: "/admin/deliveries",
    icon: Truck,
  },
  {
    title: "Schedules",
    href: "/admin/schedules",
    icon: Calendar,
  },
  {
    title: "Inventory",
    href: "/admin/inventory",
    icon: Package,
  },
]

const customersNav = [
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
]

const financeNav = [
  {
    title: "Payments",
    href: "/admin/payments",
    icon: CreditCard,
  },
  {
    title: "Invoices",
    href: "/admin/invoices",
    icon: Receipt,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
  },
]

const accountNav = [
  {
    title: "Profile",
    href: "/admin/profile",
    icon: UserCircle,
  },
]

interface NavGroup {
  label: string
  items: {
    title: string
    href: string
    icon: React.ComponentType<{ className?: string }>
  }[]
}

const navGroups: NavGroup[] = [
  { label: "Main", items: mainNav },
  { label: "Operations", items: operationsNav },
  { label: "Customers", items: customersNav },
  { label: "Finance", items: financeNav },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Clearwell Admin"
              render={<Link href="/admin/dashboard" />}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                <Droplets className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="truncate font-bold tracking-tight text-foreground">Clearwell</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-primary/15 text-primary tracking-wide">ADMIN</span>
                </div>
                <span className="truncate text-[11px] text-muted-foreground">
                  Operations Console
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/")
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        isActive={isActive}
                        tooltip={item.title}
                        render={<Link href={item.href} />}
                        className={`transition-all rounded-xl ${
                          isActive
                            ? "bg-primary/10 text-primary font-bold dark:bg-primary/20 shadow-xs"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        }`}
                      >
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          {accountNav.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip={item.title}
                  render={<Link href={item.href} />}
                >
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Logout" onClick={() => logout()} suppressHydrationWarning>
              <LogOut className="size-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
