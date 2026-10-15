import { UserCircle, Mail, Phone, MapPin, Shield, CalendarDays, Bike, CheckCircle2 } from "lucide-react"
import { getCurrentUser } from "@/lib/services/auth/auth.service"
import { redirect } from "next/navigation"

export default async function RiderProfilePage() {
  const { data: user, error } = await getCurrentUser()

  if (error || !user) {
    redirect('/login')
  }

  const initials = (user.full_name || user.email || 'R')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const fields = [
    { label: "Courier Name", value: user.full_name || "Not set", icon: UserCircle },
    { label: "Dispatch Email", value: user.email, icon: Mail },
    { label: "Courier Phone", value: user.phone || "Not set", icon: Phone },
    { label: "Base Station Address", value: user.address || "Not set", icon: MapPin },
    { label: "Field Role", value: user.role, icon: Shield },
    { label: "Active On Fleet Since", value: new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), icon: CalendarDays },
  ]

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Courier Profile</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Your delivery personnel credentials and dispatch assignment identity.
        </p>
      </div>

      <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
        {/* Profile Header */}
        <div className="p-6 border-b border-border/80 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xl font-bold tracking-tight shadow-xs">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-semibold text-foreground tracking-tight">
                  {user.full_name || "Field Courier"}
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  On Duty
                </span>
              </div>
              <p className="text-xs font-mono text-muted-foreground mt-0.5">{user.email}</p>
            </div>
          </div>
          <div className="inline-flex items-center self-start sm:self-center gap-1.5 rounded-md border border-border/80 bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Bike className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            Field Dispatch Active
          </div>
        </div>

        {/* Profile Details */}
        <div className="divide-y divide-border/60">
          {fields.map((field) => (
            <div key={field.label} className="flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-muted/30">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-background text-muted-foreground shadow-xs">
                <field.icon className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">{field.label}</p>
                <p className="text-sm font-medium text-foreground truncate mt-0.5 capitalize">{field.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Courier Readiness Card */}
      <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs flex items-start gap-3">
        <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-foreground">Fleet Dispatch Verified</p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            Your rider status allows you to accept assigned route dispatches, navigate via integrated Google Maps, collect Cash on Delivery payments, and log drop-off timestamps in real time.
          </p>
        </div>
      </div>
    </div>
  )
}

