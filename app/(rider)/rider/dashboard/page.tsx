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
  Banknote,
  Compass,
  RotateCcw,
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
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Today's Route
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <span className="size-2 rounded-full bg-emerald-500" />
              On Shift
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {pending.length > 0 
              ? `${pending.length} delivery stop${pending.length !== 1 ? 's' : ''} queued for your route today.`
              : 'All scheduled route deliveries are complete.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/rider/map"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
          >
            <Compass className="size-4" />
            <span>Open Route Map</span>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Remaining Stops */}
        <div className="rounded-xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Remaining Stops</p>
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Truck className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h3 className="text-2xl font-bold tabular-nums text-foreground">
              {pending.length}
            </h3>
            <span className="text-xs text-muted-foreground">to deliver</span>
          </div>
        </div>

        {/* In Transit */}
        <div className="rounded-xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">In Transit</p>
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Clock className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h3 className="text-2xl font-bold tabular-nums text-blue-600 dark:text-blue-400">
              {inTransitCount}
            </h3>
            <span className="text-xs text-muted-foreground">active drop</span>
          </div>
        </div>

        {/* Completed */}
        <div className="rounded-xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Completed Today</p>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h3 className="text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
              {completedCount}
            </h3>
            <span className="text-xs text-muted-foreground">delivered</span>
          </div>
        </div>

        {/* Cash to Remit */}
        <div className="rounded-xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Cash to Remit</p>
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Banknote className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h3 className="text-2xl font-bold tabular-nums text-foreground">
              ₱{cashToCollect.toFixed(2)}
            </h3>
            <span className="text-xs text-muted-foreground">COD balance</span>
          </div>
        </div>
      </div>

      {/* Current Stop Spotlight Card */}
      <div className={`rounded-2xl border shadow-sm overflow-hidden transition-all ${
        nextDelivery?.status === 'in-transit' 
          ? 'border-blue-500/60 bg-card ring-1 ring-blue-500/20' 
          : 'border-border/80 bg-card'
      }`}>
        <div className={`flex items-center justify-between border-b px-5 py-3.5 ${
          nextDelivery?.status === 'in-transit' 
            ? 'border-blue-500/20 bg-blue-500/5' 
            : 'border-border/70 bg-muted/30'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`flex size-8 items-center justify-center rounded-lg text-xs font-semibold ${
              nextDelivery?.status === 'in-transit' 
                ? 'bg-blue-600 text-white' 
                : 'bg-primary/10 text-primary'
            }`}>
              <Navigation className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-foreground">
                  {nextDelivery?.status === 'in-transit' ? 'Current Active Stop' : 'Next Scheduled Drop'}
                </h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-primary/10 text-primary">
                  Stop #1 of {pending.length}
                </span>
              </div>
            </div>
          </div>

          {nextDelivery && (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              nextDelivery.status === 'in-transit'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
            }`}>
              <span className={`size-1.5 rounded-full ${nextDelivery.status === 'in-transit' ? 'bg-white' : 'bg-current'}`} />
              {nextDelivery.status === 'in-transit' ? 'En Route' : 'Ready to Depart'}
            </span>
          )}
        </div>

        <div className="p-5 sm:p-6">
          {nextDelivery ? (
            <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
              <div className="flex items-start gap-4 flex-1">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-base shrink-0 border border-primary/20">
                  1
                </div>

                <div className="space-y-4 flex-1 min-w-0">
                  <div>
                    <h4 className="text-xl font-bold text-foreground">
                      {(nextDelivery as any).orders?.profiles?.full_name || 'Customer'}
                    </h4>
                    
                    <div className="flex flex-col gap-2 mt-2.5 text-sm">
                      {/* Product details */}
                      <div className="flex items-center gap-2 text-foreground font-medium">
                        <Package className="size-4 text-primary shrink-0" />
                        <span>
                          {(nextDelivery as any).orders?.order_items?.[0]?.products?.name || '19L Water Gallon Refill'}
                        </span>
                      </div>

                      {/* Delivery Address */}
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <MapPin className="size-4 text-blue-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">
                          {(nextDelivery as any).orders?.delivery_address?.includes('|') 
                            ? (nextDelivery as any).orders.delivery_address.split('|')[1] 
                            : ((nextDelivery as any).orders?.delivery_address || 'Address provided on file')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Empty Bottle Swap Reminder & Notes */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500/10 px-2.5 py-1 text-xs font-medium text-sky-700 dark:text-sky-300 border border-sky-500/20">
                      <RotateCcw className="size-3.5" />
                      Collect empty carboy on swap
                    </span>

                    {(nextDelivery as any).notes && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-400 border border-amber-500/20">
                        Note: {(nextDelivery as any).notes}
                      </span>
                    )}
                  </div>

                  {/* Rider Quick Action Shortcuts */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {(nextDelivery as any).orders?.profiles?.phone && (
                      <a
                        href={`tel:${(nextDelivery as any).orders.profiles.phone}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                      >
                        <Phone className="size-3.5 text-emerald-600" />
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
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                      >
                        <ExternalLink className="size-3.5 text-primary" />
                        Open Google Maps
                      </a>
                    )}
                  </div>

                  {/* Delivery Status Update Buttons */}
                  <div className="pt-2 border-t border-border/60">
                    <DeliveryActions 
                      deliveryId={nextDelivery.id} 
                      status={nextDelivery.status} 
                      address={(nextDelivery as any).orders?.delivery_address} 
                    />
                  </div>
                </div>
              </div>

              {/* Amount & Settlement Info */}
              <div className="w-full lg:w-60 rounded-xl border border-border/80 bg-muted/30 p-4 sm:p-5 flex flex-col justify-between shrink-0">
                <div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Payment Due
                  </span>
                  <div className="text-3xl font-bold tabular-nums text-foreground mt-1">
                    ₱{(nextDelivery as any).orders?.total_amount?.toFixed(2) || '0.00'}
                  </div>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold mt-2 ${
                    ((nextDelivery as any).orders?.payment_method || '').toLowerCase().includes('cash')
                      ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                  }`}>
                    <span className="size-1.5 rounded-full bg-current" />
                    {(nextDelivery as any).orders?.payment_method || 'Cash on Delivery'}
                  </span>
                </div>
                
                <p className="text-xs text-muted-foreground mt-4 pt-3 border-t border-border/60">
                  {((nextDelivery as any).orders?.payment_method || '').toLowerCase().includes('cash')
                    ? '⚠️ Collect cash before handing over water bottles.'
                    : '✓ Already settled online. No cash collection required.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center flex flex-col items-center justify-center">
              <div className="size-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <CheckCircle2 className="size-6" />
              </div>
              <h3 className="font-semibold text-base text-foreground">All route deliveries completed!</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                You have fulfilled all assigned customer stops. Check with station dispatch if new orders arrive.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Subsequent Stops in Queue */}
      {pending.length > 1 && (
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Clock className="size-4 text-muted-foreground" />
              Upcoming Stops ({pending.length - 1} Remaining)
            </h3>
            <Link href="/rider/deliveries" className="text-xs font-semibold text-primary hover:underline">
              View all stops
            </Link>
          </div>

          <div className="divide-y divide-border/60">
            {pending.slice(1).map((d: any, idx: number) => (
              <div key={d.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-muted font-semibold text-muted-foreground shrink-0 text-xs">
                    {idx + 2}
                  </span>
                  <div className="truncate">
                    <p className="font-semibold text-foreground truncate text-sm">
                      {d.orders?.profiles?.full_name || 'Customer'}
                    </p>
                    <p className="text-muted-foreground truncate text-xs mt-0.5">
                      {d.orders?.delivery_address?.includes('|') ? d.orders.delivery_address.split('|')[1] : d.orders?.delivery_address}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="font-semibold text-foreground block">
                      ₱{d.orders?.total_amount?.toFixed(2) || '0.00'}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {d.orders?.payment_method || 'COD'}
                    </span>
                  </div>
                  <Link
                    href={`/rider/map?deliveryId=${d.id}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-border/80 px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <span>Route</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
