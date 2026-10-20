import { 
  Droplets, 
  ShoppingCart, 
  Calendar, 
  Receipt, 
  MapPin, 
  Package, 
  ArrowRight, 
  ArrowRightCircle, 
  CheckCircle2, 
  Clock, 
  Truck,
  Plus,
  CreditCard,
  Phone,
  Bike,
  UserCheck,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from "lucide-react"
import { getCustomerDashboardStats } from "@/lib/actions/customer"
import { CustomerCreateOrderDialog } from "@/components/customer/customer-create-order-dialog"
import Link from "next/link"
import Image from "next/image"

export default async function CustomerDashboardPage() {
  const { data, error } = await getCustomerDashboardStats()
  
  const activeOrders = data?.activeOrders || []
  const activeSchedules = data?.activeSchedules || []
  const pendingInvoices = data?.pendingInvoices || []

  const activeCount = activeOrders.filter((o: any) => o.status !== 'delivered' && o.status !== 'cancelled').length
  const nextOrder = activeOrders.find((o: any) => o.status !== 'delivered' && o.status !== 'cancelled')

  // Extract assigned rider/delivery info if available
  const delivery = Array.isArray((nextOrder as any)?.deliveries) 
    ? (nextOrder as any).deliveries[0] 
    : (nextOrder as any)?.deliveries

  const rider = delivery?.profiles

  // Delivery status stepper calculation (Mobbin Uber/DoorDash delivery pattern)
  const getStepProgress = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 1
      case 'processing': return 2
      case 'in-transit': return 3
      case 'delivered': return 4
      default: return 1
    }
  }

  const currentStep = nextOrder ? getStepProgress(nextOrder.status) : 0

  return (
    <div className="space-y-6">
      {/* Top Header / Hero */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black tracking-tight text-foreground md:text-3xl">
              Customer Portal
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-blue-500" />
              </span>
              Account Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Track active container drops, schedule automated refills, and view monthly settlements.
          </p>
        </div>
        
        <CustomerCreateOrderDialog trigger={
          <button className="tactile-btn inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm shadow-primary/25 hover:bg-primary/90">
            <Plus className="size-4" />
            Order Water Refill
          </button>
        } />
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Active Orders */}
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md p-5 shadow-xs transition-all duration-300 hover:border-primary/40 hover:shadow-md group">
          <div className="flex items-center justify-between">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">Active Drops</p>
            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-xs">
              <ShoppingCart className="size-4" />
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <h3 className="text-3xl font-extrabold font-mono tabular-nums tracking-tight text-foreground">
              {activeCount}
            </h3>
            <p className="text-xs text-muted-foreground">
              {activeCount > 0 ? "Fulfillment in progress" : "No orders in transit"}
            </p>
          </div>
        </div>
        
        {/* Active Schedules */}
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md p-5 shadow-xs transition-all duration-300 hover:border-primary/40 hover:shadow-md group">
          <div className="flex items-center justify-between">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">Recurring Plans</p>
            <div className="flex size-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shadow-xs">
              <Calendar className="size-4" />
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <h3 className="text-3xl font-extrabold font-mono tabular-nums tracking-tight text-foreground">
              {activeSchedules.length}
            </h3>
            <p className="text-xs text-muted-foreground">Automated refill schedules</p>
          </div>
        </div>

        {/* Pending Invoices */}
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md p-5 shadow-xs transition-all duration-300 hover:border-primary/40 hover:shadow-md group">
          <div className="flex items-center justify-between">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">Pending Balance</p>
            <div className={`flex size-9 items-center justify-center rounded-xl border shadow-xs ${
              pendingInvoices.length > 0 
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' 
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
            }`}>
              <Receipt className="size-4" />
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <h3 className={`text-3xl font-extrabold font-mono tabular-nums tracking-tight ${
              pendingInvoices.length > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'
            }`}>
              {pendingInvoices.length}
            </h3>
            <p className="text-xs text-muted-foreground">
              {pendingInvoices.length > 0 ? "Awaiting payment settlement" : "All balances settled"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Delivery Tracker (4/7) + Quick Actions (3/7) */}
      <div className="grid gap-6 lg:grid-cols-7 items-start">
        {/* Latest Order Status & Progress Tracker */}
        <div className="rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md shadow-xs overflow-hidden lg:col-span-4 flex flex-col">
          <div className="flex items-center justify-between border-b border-border/70 p-5">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                <Truck className="size-4.5" />
              </div>
              <div>
                <h2 className="text-sm font-bold tracking-tight text-foreground">Live Delivery Tracking</h2>
                <p className="text-xs text-muted-foreground">
                  {nextOrder ? "Real-time dispatch status" : "No ongoing deliveries"}
                </p>
              </div>
            </div>

            {nextOrder && (
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-lg bg-muted/60 border border-border/70 text-foreground font-bold">
                #{nextOrder.id.slice(0, 8).toUpperCase()}
              </span>
            )}
          </div>

          <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
            {nextOrder ? (
              <div className="space-y-6">
                {/* Visual Delivery Stepper */}
                <div className="bg-muted/30 p-5 rounded-2xl border border-border/60">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">Progress Telemetry</span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                      nextOrder.status.toLowerCase() === 'delivered' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' :
                      nextOrder.status.toLowerCase() === 'in-transit' ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20' :
                      'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
                    }`}>
                      <span className="size-1.5 rounded-full bg-current animate-pulse" />
                      {nextOrder.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>

                  {/* 4-Step Progress Indicator */}
                  <div className="relative pt-3 pb-1">
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-muted">
                      <div 
                        style={{ width: `${(currentStep / 4) * 100}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 text-center">
                      <div className="text-[11px] font-semibold text-foreground">
                        <div className={`mx-auto size-6 rounded-full flex items-center justify-center text-[10px] mb-1.5 ${currentStep >= 1 ? 'bg-primary text-primary-foreground font-bold' : 'bg-muted text-muted-foreground'}`}>
                          {currentStep > 1 ? '✓' : '1'}
                        </div>
                        Placed
                      </div>
                      <div className="text-[11px] font-semibold text-foreground">
                        <div className={`mx-auto size-6 rounded-full flex items-center justify-center text-[10px] mb-1.5 ${currentStep >= 2 ? 'bg-primary text-primary-foreground font-bold' : 'bg-muted text-muted-foreground'}`}>
                          {currentStep > 2 ? '✓' : '2'}
                        </div>
                        Prepped
                      </div>
                      <div className="text-[11px] font-semibold text-foreground">
                        <div className={`mx-auto size-6 rounded-full flex items-center justify-center text-[10px] mb-1.5 ${currentStep >= 3 ? 'bg-primary text-primary-foreground font-bold' : 'bg-muted text-muted-foreground'}`}>
                          {currentStep > 3 ? '✓' : '3'}
                        </div>
                        En Route
                      </div>
                      <div className="text-[11px] font-semibold text-foreground">
                        <div className={`mx-auto size-6 rounded-full flex items-center justify-center text-[10px] mb-1.5 ${currentStep >= 4 ? 'bg-primary text-primary-foreground font-bold' : 'bg-muted text-muted-foreground'}`}>
                          {currentStep >= 4 ? '✓' : '4'}
                        </div>
                        Delivered
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assigned Courier Panel */}
                {rider ? (
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3.5">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-extrabold text-sm shadow-xs">
                        {rider.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'CR'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">Assigned Courier</span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {delivery?.status === 'in-transit' ? 'On The Way' : 'Route Scheduled'}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-foreground mt-0.5">{rider.full_name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{rider.phone || 'Clearwell Courier Fleet'}</p>
                      </div>
                    </div>

                    {rider.phone && (
                      <a
                        href={`tel:${rider.phone}`}
                        className="tactile-btn inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all self-start sm:self-center"
                      >
                        <Phone className="size-3.5" />
                        Call Courier
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 p-4 flex items-center gap-3.5">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground border border-border/70">
                      <Truck className="size-4.5" />
                    </div>
                    <div className="min-w-0 flex-1 text-xs">
                      <p className="font-bold text-foreground text-sm">Station Assigning Nearest Courier</p>
                      <p className="text-muted-foreground text-[11px] mt-0.5">
                        Our station dispatch system is assigning the closest route courier to your delivery.
                      </p>
                    </div>
                  </div>
                )}

                {/* Order Itemization & Destination */}
                <div className="space-y-3 divide-y divide-border/60 text-sm">
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-muted-foreground font-semibold">Product Item</span>
                    <span className="font-bold text-foreground text-sm">
                      {Array.isArray(nextOrder.order_items?.[0]?.products) 
                        ? nextOrder.order_items[0].products[0]?.name 
                        : (nextOrder.order_items?.[0]?.products as any)?.name || '5-Gallon Purified Water'}
                    </span>
                  </div>

                  <div className="flex items-start justify-between pt-3">
                    <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-blue-600" /> Destination
                    </span>
                    <span className="text-xs text-foreground font-medium text-right max-w-[260px]">
                      {(nextOrder as any)?.delivery_address?.includes('|') 
                        ? (nextOrder as any).delivery_address.split('|')[1] 
                        : ((nextOrder as any)?.delivery_address || 'Registered Address')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3">
                    <span className="text-xs text-muted-foreground font-semibold">Total Amount</span>
                    <span className="font-mono text-xl font-bold tabular-nums text-foreground">
                      ₱{nextOrder.total_amount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-border/60">
                  <span className="text-xs text-muted-foreground">
                    Direct gate bottle exchange & payment
                  </span>
                  <Link 
                    href="/customer/orders" 
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline transition-colors"
                  >
                    View order history
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="relative size-20 rounded-2xl overflow-hidden border border-border/80 shadow-xs mb-3 bg-muted">
                  <Image
                    src="/images/customer_dashboard_banner.jpg"
                    alt="Pristine water refill container"
                    fill
                    sizes="80px"
                    loading="eager"
                    className="object-cover"
                  />
                </div>
                <h4 className="font-bold text-base text-foreground">No Active Drops</h4>
                <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">
                  Your hydration supply is current. Place a doorstep bottle swap whenever you need fresh water.
                </p>
                <div className="mt-5 flex flex-col sm:flex-row items-center gap-3">
                  <CustomerCreateOrderDialog trigger={
                    <button className="tactile-btn inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90">
                      <Plus className="size-3.5" />
                      Place Refill Order
                    </button>
                  } />
                  <Link 
                    href="/customer/orders" 
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
                  >
                    <span>View past orders</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="space-y-4 lg:col-span-3">
          {/* Hydration Banner */}
          <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md shadow-xs group">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
              <Image
                src="/images/customer_dashboard_banner.jpg"
                alt="Clearwell purified water dispenser setup"
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                loading="eager"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider bg-primary/90 text-primary-foreground px-2.5 py-0.5 rounded-full shadow-xs">
                  Automated Refills
                </span>
                <h3 className="text-sm font-bold mt-1 text-white leading-tight drop-shadow-xs">
                  Weekly Hydration Schedule
                </h3>
                <p className="text-[11px] text-white/85 line-clamp-1 mt-0.5">
                  Set recurring days so you never run out of clean drinking water.
                </p>
              </div>
            </div>
            <div className="p-3.5 bg-card border-t border-border/60 flex items-center justify-between text-xs">
              <span className="font-mono text-[11px] text-muted-foreground">Doorstep Swap Ready</span>
              <CustomerCreateOrderDialog trigger={
                <button className="inline-flex items-center gap-1 font-bold text-primary hover:underline cursor-pointer">
                  <span>Order Refill</span>
                  <ArrowRight className="size-3" />
                </button>
              } />
            </div>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md p-5 shadow-xs">
            <h2 className="text-sm font-bold tracking-tight text-foreground mb-1">Quick Shortcuts</h2>
            <p className="text-xs text-muted-foreground mb-4">Fast actions for your account</p>

            <div className="flex flex-col gap-2.5">
              <CustomerCreateOrderDialog trigger={
                <button className="tactile-btn group relative flex h-14 w-full items-center justify-start gap-3.5 rounded-xl border border-border/70 bg-background px-4 py-2.5 text-sm font-medium transition-all hover:border-primary/40">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <ShoppingCart className="size-4" />
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-bold text-foreground">Order Water Refill</span>
                    <span className="block text-[11px] text-muted-foreground">Slim 19L, round or bottle packs</span>
                  </div>
                  <ArrowRightCircle className="size-4 ml-auto text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </button>
              } />
              
              <Link 
                href="/customer/invoices" 
                className="tactile-btn group relative flex h-14 w-full items-center justify-start gap-3.5 rounded-xl border border-border/70 bg-background px-4 py-2.5 text-sm font-medium transition-all hover:border-primary/40"
              >
                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Receipt className="size-4" />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold text-foreground">Invoices & Statements</span>
                  <span className="block text-[11px] text-muted-foreground">Download receipts & payment records</span>
                </div>
                <ArrowRightCircle className="size-4 ml-auto text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>

              <Link 
                href="/customer/profile" 
                className="tactile-btn group relative flex h-14 w-full items-center justify-start gap-3.5 rounded-xl border border-border/70 bg-background px-4 py-2.5 text-sm font-medium transition-all hover:border-primary/40"
              >
                <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <MapPin className="size-4" />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold text-foreground">Delivery Pinned Location</span>
                  <span className="block text-[11px] text-muted-foreground">Update GPS map pin & gate notes</span>
                </div>
                <ArrowRightCircle className="size-4 ml-auto text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            </div>
          </div>

          {/* Clean Station Contact Card */}
          <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 text-xs">
            <div className="flex items-center gap-2 font-bold text-foreground mb-1">
              <Phone className="size-3.5 text-primary" />
              <span>Station Dispatch Support</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Need assistance with container swaps or special delivery windows? Our hub operators are active.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
