"use client"

import { usePathname } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import React from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationsMenu } from "@/components/ui/notifications-menu"

/** Maps URL slugs to human-readable page titles */
const pageTitles: Record<string, string> = {
  admin: "Admin",
  dashboard: "Dashboard",
  customers: "Customers",
  orders: "Orders",
  inventory: "Inventory",
  deliveries: "Deliveries",
  schedules: "Schedules",
  payments: "Payments",
  invoices: "Invoices",
  reports: "Reports",
  profile: "Profile",
}

function toTitle(segment: string): string {
  return (
    pageTitles[segment] ??
    segment.charAt(0).toUpperCase() + segment.slice(1)
  )
}

export function AdminHeader() {
  const pathname = usePathname()

  // Build breadcrumb segments from the pathname
  // e.g. /admin/orders → ["admin", "orders"]
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .filter((s) => s !== "admin") // remove base "admin" segment from crumbs
  const fullSegments = pathname.split("/").filter(Boolean)

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border/80 bg-background/85 px-4 backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/admin/dashboard">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            {segments.length > 0 && (
              <>
                <BreadcrumbSeparator className="hidden md:block" />
                {segments.map((segment, index) => {
                  const isLast = index === segments.length - 1
                  // Build the href for this segment
                  const href =
                    "/" +
                    fullSegments.slice(0, fullSegments.indexOf(segment) + 1).join("/")

                  return (
                    <React.Fragment key={segment}>
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage>{toTitle(segment)}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={href}>
                            {toTitle(segment)}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!isLast && <BreadcrumbSeparator />}
                    </React.Fragment>
                  )
                })}
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-full border border-border/60">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Operations Live</span>
        </div>
        <NotificationsMenu role="admin" />
        <ThemeToggle />
      </div>
    </header>
  )
}
