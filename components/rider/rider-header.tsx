import { SidebarTrigger } from "@/components/ui/sidebar"
import { Navigation } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationsMenu } from "@/components/ui/notifications-menu"

export function RiderHeader({ profile }: { profile?: { full_name: string } }) {
  const name = profile?.full_name || 'Rider'
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/80 bg-background/85 px-4 sm:px-6 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="mr-2" />
        <div className="hidden md:flex items-center gap-2 text-xs font-medium text-muted-foreground bg-muted/40 px-3 py-1 rounded-full border border-border/60">
          <Navigation className="size-3.5 text-primary" />
          <span className="font-medium text-foreground">Clearwell Courier Dispatch</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Active Shift</span>
        </div>
        <NotificationsMenu role="rider" />
        <ThemeToggle />
        <div className="flex items-center gap-2 pl-1 border-l border-border/60">
          <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs border border-primary/20">
            {initials}
          </div>
          <div className="hidden md:block text-left text-xs">
            <p className="font-medium text-foreground leading-none">{name}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
