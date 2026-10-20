'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ShoppingCart, Receipt, User } from "lucide-react"

const navItems = [
  {
    title: "Dashboard",
    href: "/customer/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Orders",
    href: "/customer/orders",
    icon: ShoppingCart,
  },
  {
    title: "Invoices",
    href: "/customer/invoices",
    icon: Receipt,
  },
  {
    title: "Profile",
    href: "/customer/profile",
    icon: User,
  },
]

export function CustomerBottomNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-border/80 bg-background/95 px-2 backdrop-blur-md md:hidden shadow-lg safe-bottom"
    >
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/customer/dashboard" && pathname.startsWith(item.href + "/"))

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 min-w-[64px] ${
              isActive
                ? "text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground active:scale-95"
            }`}
          >
            <div
              className={`flex size-8 items-center justify-center rounded-lg transition-colors ${
                isActive ? "bg-primary/15 text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="size-4.5" />
            </div>
            <span className="text-[10px] tracking-tight leading-none mt-1 font-medium">
              {item.title}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
