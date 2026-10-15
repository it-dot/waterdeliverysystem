import { getCustomerProfile } from "@/lib/actions/customer"
import { User, Mail, Phone, MapPin, CalendarDays, ShieldCheck } from "lucide-react"

export default async function CustomerProfilePage() {
  const { data: profile, error } = await getCustomerProfile()

  if (error || !profile) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-sm text-destructive">
        Unable to load your profile details. Please try refreshing or sign in again.
      </div>
    )
  }

  const initials = (profile.full_name || profile.email || 'C')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Account Profile</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          View and manage your personal water delivery details and contact information.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Profile Info */}
        <div className="md:col-span-2 rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
          <div className="p-6 border-b border-border/80 bg-muted/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 text-xl font-bold tracking-tight shadow-xs">
                {initials}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground tracking-tight">
                  {profile.full_name || 'Customer'}
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    Verified Customer
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="divide-y divide-border/60">
            <div className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/30">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-background text-muted-foreground shadow-xs">
                <Mail className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">Email Address</p>
                <p className="text-sm font-medium text-foreground truncate mt-0.5">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/30">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-background text-muted-foreground shadow-xs">
                <Phone className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">Phone Number</p>
                <p className="text-sm font-medium text-foreground truncate mt-0.5">{profile.phone || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 px-6 py-4 transition-colors hover:bg-muted/30">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-background text-muted-foreground shadow-xs mt-0.5">
                <MapPin className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">Default Delivery Address</p>
                <p className="text-sm font-medium text-foreground mt-0.5 leading-relaxed">{profile.address || 'No default address specified'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              Account Verification
            </h3>
            <div className="space-y-3 pt-1">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-border/60">
                <span className="text-muted-foreground">Account Status</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-border/60">
                <span className="text-muted-foreground">Registered</span>
                <span className="font-medium text-foreground">
                  {new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Role Clearance</span>
                <span className="font-mono uppercase text-foreground font-medium">{profile.role}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-4 text-xs text-muted-foreground leading-relaxed">
            Need to update your primary address or contact phone number? Reach out to station dispatch or update during order checkout.
          </div>
        </div>
      </div>
    </div>
  )
}

