import { 
  Truck, 
  MapPin, 
  Clock, 
  Navigation, 
  CheckCircle2, 
  Package, 
  ArrowRight,
  Phone,
  ExternalLink,
  AlertCircle
} from "lucide-react"
import { getRiderDashboardData } from "@/lib/actions/rider"
import { DeliveryActions } from "@/components/rider/delivery-actions"
import Link from "next/link"

export default async function RiderDashboardPage() {
  const { data } = await getRiderDashboardData()

  const pending = data?.pending || []
  const completedCount = data?.completedCount || 0
  const nextDelivery = pending[0]
  const inTransitCount = pending.filter((d: any) => d.status === 'in-transit').length

  // Calculate total cash collection pending
  const cashToCollect = pending
    .filter((d: any) => (d.orders?.payment_method?.toLowerCase() || '').includes('cash'))
    .reduce((sum: number, d: any) => sum + (d.orders?.total_amount || 0), 0)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Route & Dispatch Queue
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              On Duty
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            You have {pending.length} delivery stop{pending.length !== 1 ? 's' : ''} assigned for today's route.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/rider/map"
            className="tactile-btn inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
          >
            <Navigation className="size-3.5" />
            Open Route Map
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Pending Stops */}
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs transition-all duration-200 hover:border-border hover:shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pending Drops</p>
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/15">
              <Truck className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h3 className="text-3xl font-bold font-mono tabular-nums tracking-tight text-foreground">
              {pending.length}
            </h3>
            <span className="text-xs text-muted-foreground">Remaining stops</span>
          </div>
        </div>

        {/* In Transit */}
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs transition-all duration-200 hover:border-border hover:shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">In Transit</p>
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/15">
              <Clock className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h3 className="text-3xl font-bold font-mono tabular-nums tracking-tight text-blue-600 dark:text-blue-400">
              {inTransitCount}
            </h3>
            <span className="text-xs text-muted-foreground">Active delivery</span>
          </div>
        </div>

        {/* Completed Today */}
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs transition-all duration-200 hover:border-border hover:shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Completed Today</p>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h3 className="text-3xl font-bold font-mono tabular-nums tracking-tight text-emerald-600 dark:text-emerald-400">
              {completedCount}
            </h3>
            <span className="text-xs text-muted-foreground">Fulfilled drops</span>
          </div>
        </div>

        {/* Cash to Remit */}
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs transition-all duration-200 hover:border-border hover:shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cash to Collect</p>
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/15">
              <Navigation className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h3 className="text-3xl font-bold font-mono tabular-nums tracking-tight text-foreground">
              ₱{cashToCollect.toFixed(2)}
            </h3>
            <span className="text-xs text-muted-foreground">COD orders</span>
          </div>
        </div>
      </div>

      {/* Next Delivery Mission Card (High-Priority Courier Pattern) */}
      <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
        <div className="flex items-center justify-between border-b border-border/70 p-5 bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Navigation className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold tracking-tight text-foreground">Immediate Priority Stop</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/15 text-primary uppercase">
                  Stop #1
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Current active delivery destination</p>
            </div>
          </div>

          {nextDelivery && (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
              nextDelivery.status === 'in-transit'
                ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20'
                : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
            }`}>
              <span className="size-1.5 rounded-full bg-current animate-pulse" />
              {nextDelivery.status.replace('-', ' ').toUpperCase()}
            </span>
          )}
        </div>

        <div className="p-6">
          {nextDelivery ? (
            <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
              <div className="flex items-start gap-4 flex-1">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground font-mono font-bold text-lg shrink-0 shadow-xs">
                  1
                </div>

                <div className="space-y-3 flex-1 min-w-0">
                  <div>
                    <h4 className="text-lg font-bold text-foreground">
                      {(nextDelivery as any).orders?.profiles?.full_name || 'Customer'}
                    </h4>
                    
                    <div className="flex flex-col gap-1.5 mt-2 text-xs">
                      {/* Product line */}
                      <div className="flex items-center gap-2 text-foreground font-medium">
                        <Package className="size-4 text-primary shrink-0" />
                        <span>
                          {(nextDelivery as any).orders?.order_items?.[0]?.products?.name || 'Water Gallon Item'}
                        </span>
                      </div>

                      {/* Delivery Address */}
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <MapPin className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                        <span className="leading-relaxed">
                          {(nextDelivery as any).orders?.delivery_address?.includes('|') 
                            ? (nextDelivery as any).orders.delivery_address.split('|')[1] 
                            : ((nextDelivery as any).orders?.delivery_address || 'Address on file')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Badges & Instructions */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {(nextDelivery as any).orders?.profiles?.phone && (
                      <a
                        href={`tel:${(nextDelivery as any).orders.profiles.phone}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-xs"
                      >
                        <Phone className="size-3 text-primary" />
                        Call {(nextDelivery as any).orders.profiles.phone}
                      </a>
                    )}

                    {(nextDelivery as any).orders?.delivery_address && (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          (nextDelivery as any).orders.delivery_address.includes('|')
                            ? (nextDelivery as any).orders.delivery_address.split('|')[1]
                            : (nextDelivery as any).orders.delivery_address
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-xs"
                      >
                        <ExternalLink className="size-3 text-primary" />
                        Google Maps Navigation
                      </a>
                    )}

                    {(nextDelivery as any).notes && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-400 border border-amber-500/20">
                        Note: {(nextDelivery as any).notes}
                      </span>
                    )}
                  </div>

                  {/* Delivery Actions (Start transit / mark delivered) */}
                  <div className="pt-2">
                    <DeliveryActions deliveryId={nextDelivery.id} status={nextDelivery.status} />
                  </div>
                </div>
              </div>

              {/* Amount & Settlement Pill */}
              <div className="w-full lg:w-56 rounded-xl border border-border/70 bg-muted/30 p-4 flex flex-col justify-between shrink-0">
                <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
                  Drop Balance
                </span>
                <div className="my-2">
                  <div className="text-2xl font-bold font-mono tabular-nums text-foreground">
                    ₱{(nextDelivery as any).orders?.total_amount?.toFixed(2) || '0.00'}
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize mt-1 border border-border/60 bg-background text-foreground">
                    <span className="size-1.5 rounded-full bg-primary" />
                    Payment: {(nextDelivery as any).orders?.payment_method || 'Cash on Delivery'}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {(nextDelivery as any).orders?.payment_method?.toLowerCase() === 'cash' 
                    ? '⚠️ Collect cash before handoff' 
                    : '✓ Verified paid order'}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-10 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-muted/60 mb-3 text-muted-foreground">
                <Truck className="size-6 opacity-50" />
              </div>
              <h3 className="font-semibold text-base text-foreground">All assigned deliveries completed</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                You have fulfilled all route stops. Take a rest or check with dispatch for newly booked water orders.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Deliveries Queue */}
      {pending.length > 1 && (
        <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
          <div className="flex items-center justify-between border-b border-border/70 p-5">
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Upcoming Route Queue</h3>
              <p className="text-xs text-muted-foreground">Remaining stops scheduled after immediate delivery</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {pending.length - 1} more stops
            </span>
          </div>

          <div className="divide-y divide-border/60">
            {pending.slice(1).map((d: any, i: number) => (
              <div key={d.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-muted/40">
                <div className="flex items-center gap-3.5">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-xs font-mono font-bold text-muted-foreground shrink-0 border border-border/60">
                    #{i + 2}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      {d.orders?.profiles?.full_name || 'Customer'}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Package className="size-3 text-muted-foreground" />
                        {d.orders?.order_items?.[0]?.products?.name || 'Water Gallon'}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3 text-muted-foreground" />
                        {d.orders?.delivery_address?.includes('|') ? d.orders.delivery_address.split('|')[1] : d.orders?.delivery_address}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pl-11 sm:pl-0">
                  <span className="font-mono text-sm font-bold tabular-nums text-foreground">
                    ₱{d.orders?.total_amount?.toFixed(2) || '0.00'}
                  </span>
                  <span className="text-[11px] text-muted-foreground capitalize px-2 py-0.5 rounded bg-muted/60 border border-border/50">
                    {d.orders?.payment_method || 'COD'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
