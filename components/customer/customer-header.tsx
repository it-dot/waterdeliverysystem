import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationsMenu } from "@/components/ui/notifications-menu"
import { Droplets } from "lucide-react"

export function CustomerHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border/80 bg-background/85 px-4 sm:px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1" />
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 px-3 py-1 rounded-full border border-border/60">
          <Droplets className="size-3 text-primary" />
          <span className="font-medium text-foreground">Clearwell Water Service</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Station Active</span>
        </div>
        <NotificationsMenu role="customer" />
        <ThemeToggle />
      </div>
    </header>
  )
}
