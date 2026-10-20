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
  AlertCircle,
  Sparkles,
  Banknote,
  Compass,
} from "lucide-react"
import { getRiderDashboardData } from "@/lib/actions/rider"
import { DeliveryActions } from "@/components/rider/delivery-actions"
import Link from "next/link"
import Image from "next/image"

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
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black tracking-tight text-foreground md:text-3xl">
              Courier Dispatch Cockpit
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              Shift Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            You have {pending.length} delivery stop{pending.length !== 1 ? 's' : ''} queued for today's municipal route.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/rider/map"
            className="tactile-btn inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm shadow-primary/25 hover:bg-primary/90"
          >
            <Compass className="size-4" />
            Turn-by-Turn GPS Map
          </Link>
        </div>
      </div>

      {/* Fleet Courier Route Visual Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md shadow-xs">
        <div className="grid md:grid-cols-12 items-center">
          <div className="p-5 sm:p-6 md:col-span-7 flex flex-col justify-between h-full space-y-4">
            <div>
              <div className="flex items-center gap-2">
                {nextDelivery?.status === 'in-transit' ? (
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-white animate-ping" />
                    Active Mission In Transit
                  </span>
                ) : (
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-0.5 rounded-full border border-primary/20">
                    Sector 01 Metro Delivery Route
                  </span>
                )}
                <span className="font-mono text-xs text-muted-foreground">Hub 01 Dispatch</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground mt-2">
                {nextDelivery?.status === 'in-transit'
                  ? `En Route to ${(nextDelivery as any).orders?.profiles?.full_name || 'Customer'}`
                  : 'Courier Delivery Mission Active'}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-md leading-relaxed">
                {nextDelivery?.status === 'in-transit'
                  ? `Delivery in progress to ${(nextDelivery as any).orders?.delivery_address?.includes('|') ? (nextDelivery as any).orders.delivery_address.split('|')[1] : ((nextDelivery as any).orders?.delivery_address || 'customer destination')}. Collect empty carboys and gate settlement.`
                  : 'Racks stocked with 19L carboys. Collect empty jugs at each drop and verify cash or QR payment.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/rider/map"
                className="tactile-btn inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90"
              >
                <Navigation className="size-3.5" />
                <span>Live Route Navigation</span>
              </Link>
              <span className="font-mono text-xs text-muted-foreground">
                99.4% On-time route record
              </span>
            </div>
          </div>

          <div className="relative aspect-[16/9] md:aspect-auto md:h-full md:col-span-5 min-h-[160px] overflow-hidden bg-muted border-t md:border-t-0 md:border-l border-border/70">
            <Image
              src="/images/rider_dashboard_banner.jpg"
              alt="Clearwell courier motorcycle with water racks"
              fill
              sizes="(max-width: 768px) 100vw, 42vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-3 right-3 text-[10px] font-mono text-white/90 bg-black/60 px-2.5 py-0.5 rounded-full backdrop-blur-xs border border-white/20">
              Courier Unit #R-04
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Pending Stops */}
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md p-4 sm:p-5 shadow-xs transition-all duration-300 hover:border-primary/40 hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">Pending Drops</p>
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-xs">
              <Truck className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums tracking-tight text-foreground">
              {pending.length}
            </h3>
            <span className="text-[11px] sm:text-xs text-muted-foreground font-medium">Stops remaining</span>
          </div>
        </div>

        {/* In Transit */}
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md p-4 sm:p-5 shadow-xs transition-all duration-300 hover:border-primary/40 hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">In Transit</p>
            <div className="flex size-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-xs">
              <Clock className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums tracking-tight text-blue-600 dark:text-blue-400">
              {inTransitCount}
            </h3>
            <span className="text-[11px] sm:text-xs text-muted-foreground font-medium">Active mission</span>
          </div>
        </div>

        {/* Completed Today */}
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md p-4 sm:p-5 shadow-xs transition-all duration-300 hover:border-primary/40 hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">Completed</p>
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-xs">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums tracking-tight text-emerald-600 dark:text-emerald-400">
              {completedCount}
            </h3>
            <span className="text-[11px] sm:text-xs text-muted-foreground font-medium">Drops fulfilled</span>
          </div>
        </div>

        {/* Cash to Remit */}
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md p-4 sm:p-5 shadow-xs transition-all duration-300 hover:border-primary/40 hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">Cash to Collect</p>
            <div className="flex size-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-xs">
              <Banknote className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums tracking-tight text-foreground">
              ₱{cashToCollect.toFixed(2)}
            </h3>
            <span className="text-[11px] sm:text-xs text-muted-foreground font-medium">COD balance</span>
          </div>
        </div>
      </div>

      {/* Next Delivery Mission Card */}
      <div className={`rounded-2xl border shadow-sm overflow-hidden transition-all ${
        nextDelivery?.status === 'in-transit' 
          ? 'border-blue-500/60 bg-card ring-2 ring-blue-500/25' 
          : 'border-border/80 bg-card'
      }`}>
        <div className={`flex items-center justify-between border-b p-4 sm:p-5 ${
          nextDelivery?.status === 'in-transit' 
            ? 'border-blue-500/20 bg-blue-500/10' 
            : 'border-border/70 bg-muted/20'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`flex size-9 items-center justify-center rounded-xl shadow-xs ${
              nextDelivery?.status === 'in-transit' 
                ? 'bg-blue-600 text-white' 
                : 'bg-primary/10 text-primary border border-primary/20'
            }`}>
              <Navigation className={`size-4.5 ${nextDelivery?.status === 'in-transit' ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold tracking-tight text-foreground">
                  {nextDelivery?.status === 'in-transit' ? 'Active Mission In Transit' : 'Next Priority Drop'}
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase shadow-xs ${
                  nextDelivery?.status === 'in-transit'
                    ? 'bg-blue-600 text-white'
                    : 'bg-primary/15 text-primary'
                }`}>
                  {nextDelivery?.status === 'in-transit' ? 'Top of Queue' : 'Stop #1'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {nextDelivery?.status === 'in-transit' 
                  ? 'Delivery started · Courier on route to destination' 
                  : 'Immediate delivery assignment'}
              </p>
            </div>
          </div>

          {nextDelivery && (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              nextDelivery.status === 'in-transit'
                ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
            }`}>
              <span className={`size-1.5 rounded-full ${nextDelivery.status === 'in-transit' ? 'bg-white animate-ping' : 'bg-current animate-pulse'}`} />
              {nextDelivery.status === 'in-transit' ? 'EN ROUTE' : nextDelivery.status.replace('-', ' ').toUpperCase()}
            </span>
          )}
        </div>

        <div className="p-5 sm:p-6">
          {nextDelivery ? (
            <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
              <div className="flex items-start gap-4 flex-1">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-mono font-bold text-lg shrink-0 shadow-xs">
                  1
                </div>

                <div className="space-y-3.5 flex-1 min-w-0">
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
                        <MapPin className="size-4 text-blue-600 shrink-0 mt-0.5" />
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
                        className="tactile-btn inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-background px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted"
                      >
                        <Phone className="size-3 text-emerald-600" />
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
                        className="tactile-btn inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-background px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted"
                      >
                        <ExternalLink className="size-3 text-primary" />
                        Google Maps Navigation
                      </a>
                    )}

                    {(nextDelivery as any).notes && (
                      <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 border border-amber-500/20">
                        Note: {(nextDelivery as any).notes}
                      </span>
                    )}
                  </div>

                  {/* Delivery Actions */}
                  <div className="pt-2">
                    <DeliveryActions 
                      deliveryId={nextDelivery.id} 
                      status={nextDelivery.status} 
                      address={(nextDelivery as any).orders?.delivery_address} 
                    />
                  </div>
                </div>
              </div>

              {/* Amount & Settlement Pill */}
              <div className="w-full lg:w-56 rounded-2xl border border-border/70 bg-muted/30 p-5 flex flex-col justify-between shrink-0">
                <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">
                  Drop Balance
                </span>
                <div className="my-2.5">
                  <div className="text-3xl font-extrabold font-mono tabular-nums text-foreground">
                    ₱{(nextDelivery as any).orders?.total_amount?.toFixed(2) || '0.00'}
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold capitalize mt-1.5 border border-border/60 bg-background text-foreground">
                    <span className="size-1.5 rounded-full bg-primary" />
                    Payment: {(nextDelivery as any).orders?.payment_method || 'Cash on Delivery'}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Collect empty jugs upon dropoff.
                </p>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center flex flex-col items-center justify-center">
              <div className="size-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 border border-emerald-500/20">
                <CheckCircle2 className="size-8" />
              </div>
              <h3 className="font-bold text-lg text-foreground">All Deliveries Complete!</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                You have finished all assigned water delivery stops for this shift. Stand by for new batch dispatches.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Subsequent Delivery Stops List */}
      {pending.length > 1 && (
        <div className="rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Clock className="size-4 text-muted-foreground" />
              Upcoming Queue Stops ({pending.length - 1} Remaining)
            </h3>
            <Link href="/rider/deliveries" className="text-xs font-bold text-primary hover:underline">
              View full table
            </Link>
          </div>

          <div className="divide-y divide-border/60">
            {pending.slice(1).map((d: any, idx: number) => (
              <div key={d.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-muted font-mono font-bold text-muted-foreground shrink-0 text-xs">
                    {idx + 2}
                  </span>
                  <div className="truncate">
                    <p className="font-bold text-foreground truncate">
                      {d.orders?.profiles?.full_name || 'Customer'}
                    </p>
                    <p className="text-muted-foreground truncate text-[11px]">
                      {d.orders?.delivery_address?.includes('|') ? d.orders.delivery_address.split('|')[1] : d.orders?.delivery_address}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono font-bold text-foreground">
                    ₱{d.orders?.total_amount?.toFixed(2) || '0.00'}
                  </span>
                  <Link
                    href={`/rider/map?deliveryId=${d.id}`}
                    className="tactile-btn inline-flex items-center gap-1 rounded-lg border border-border/80 px-2.5 py-1 text-[11px] font-semibold text-primary hover:bg-muted"
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
