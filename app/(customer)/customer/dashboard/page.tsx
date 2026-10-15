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
  UserCheck
} from "lucide-react"
import { getCustomerDashboardStats } from "@/lib/actions/customer"
import { CustomerCreateOrderDialog } from "@/components/customer/customer-create-order-dialog"
import Link from "next/link"

export default async function CustomerDashboardPage() {
  const { data, error } = await getCustomerDashboardStats()
  
  const activeOrders = data?.activeOrders || []
  const activeSchedules = data?.activeSchedules || []
  const pendingInvoices = data?.pendingInvoices || []

  const activeCount = activeOrders.filter((o: any) => o.status !== 'delivered' && o.status !== 'cancelled').length
  const nextOrder = activeOrders[0]

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
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Customer Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your live water deliveries, manage refill schedules, and check account billing.
          </p>
        </div>
        
        <CustomerCreateOrderDialog trigger={
          <button className="tactile-btn inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 cursor-pointer">
            <Plus className="size-4" />
            Order Water Refill
          </button>
        } />
      </div>

      {/* KPI Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Active Orders */}
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs transition-all duration-200 hover:border-border hover:shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Orders</p>
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/15">
              <ShoppingCart className="size-4" />
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <h3 className="text-3xl font-bold font-mono tabular-nums tracking-tight text-foreground">
              {activeCount}
            </h3>
            <p className="text-xs text-muted-foreground">
              {activeCount > 0 ? "Fulfillment in progress" : "No orders in transit"}
            </p>
          </div>
        </div>
        
        {/* Active Schedules */}
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs transition-all duration-200 hover:border-border hover:shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Scheduled Deliveries</p>
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/15">
              <Calendar className="size-4" />
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <h3 className="text-3xl font-bold font-mono tabular-nums tracking-tight text-foreground">
              {activeSchedules.length}
            </h3>
            <p className="text-xs text-muted-foreground">Recurring refill plans</p>
          </div>
        </div>

        {/* Unpaid Invoices */}
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs transition-all duration-200 hover:border-border hover:shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pending Invoices</p>
            <div className={`flex size-9 items-center justify-center rounded-lg border ${
              pendingInvoices.length > 0 
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' 
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
            }`}>
              <Receipt className="size-4" />
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <h3 className={`text-3xl font-bold font-mono tabular-nums tracking-tight ${
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
        <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden lg:col-span-4 flex flex-col">
          <div className="flex items-center justify-between border-b border-border/70 p-5">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Truck className="size-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold tracking-tight text-foreground">Live Delivery Status</h2>
                <p className="text-xs text-muted-foreground">Track your most recent water order</p>
              </div>
            </div>

            {nextOrder && (
              <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-muted/60 border border-border/60 text-foreground font-semibold">
                #{nextOrder.id.slice(0, 8).toUpperCase()}
              </span>
            )}
          </div>

          <div className="p-5 flex-1 flex flex-col justify-between">
            {nextOrder ? (
              <div className="space-y-6">
                {/* Visual Delivery Stepper (Mobbin / DoorDash style) */}
                <div className="bg-muted/30 p-4 rounded-xl border border-border/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-foreground">Delivery Progress</span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
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
                    <div className="overflow-hidden h-1.5 mb-4 text-xs flex rounded bg-muted">
                      <div 
                        style={{ width: `${(currentStep / 4) * 100}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 text-center">
                      <div className="text-[11px] font-medium text-foreground">
                        <div className={`mx-auto size-5 rounded-full flex items-center justify-center text-[10px] mb-1 ${currentStep >= 1 ? 'bg-primary text-primary-foreground font-bold' : 'bg-muted text-muted-foreground'}`}>
                          {currentStep > 1 ? '✓' : '1'}
                        </div>
                        Placed
                      </div>
                      <div className="text-[11px] font-medium text-foreground">
                        <div className={`mx-auto size-5 rounded-full flex items-center justify-center text-[10px] mb-1 ${currentStep >= 2 ? 'bg-primary text-primary-foreground font-bold' : 'bg-muted text-muted-foreground'}`}>
                          {currentStep > 2 ? '✓' : '2'}
                        </div>
                        Prepped
                      </div>
                      <div className="text-[11px] font-medium text-foreground">
                        <div className={`mx-auto size-5 rounded-full flex items-center justify-center text-[10px] mb-1 ${currentStep >= 3 ? 'bg-primary text-primary-foreground font-bold' : 'bg-muted text-muted-foreground'}`}>
                          {currentStep > 3 ? '✓' : '3'}
                        </div>
                        On Route
                      </div>
                      <div className="text-[11px] font-medium text-foreground">
                        <div className={`mx-auto size-5 rounded-full flex items-center justify-center text-[10px] mb-1 ${currentStep >= 4 ? 'bg-primary text-primary-foreground font-bold' : 'bg-muted text-muted-foreground'}`}>
                          {currentStep >= 4 ? '✓' : '4'}
                        </div>
                        Delivered
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assigned Courier Panel (Mobbin / DoorDash delivery pattern) */}
                {rider ? (
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-xs">
                        {rider.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'CR'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Assigned Courier</span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                            <span className="size-1 rounded-full bg-emerald-500 animate-pulse" />
                            {delivery?.status === 'in-transit' ? 'On The Way' : 'Assigned to Route'}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-foreground mt-0.5">{rider.full_name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{rider.phone || 'Clearwell Fleet Courier'}</p>
                      </div>
                    </div>

                    {rider.phone && (
                      <a
                        href={`tel:${rider.phone}`}
                        className="tactile-btn inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all self-start sm:self-center"
                      >
                        <Phone className="size-3.5" />
                        Call Rider
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-3.5 flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground border border-border/70">
                      <Truck className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1 text-xs">
                      <p className="font-semibold text-foreground">Station Assigning Courier</p>
                      <p className="text-muted-foreground text-[11px] mt-0.5">
                        Our station dispatch is scheduling the nearest fleet courier to your delivery route.
                      </p>
                    </div>
                  </div>
                )}

                {/* Order Itemization & Destination */}
                <div className="space-y-3 divide-y divide-border/60 text-sm">
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-muted-foreground font-medium">Product / Quantity</span>
                    <span className="font-semibold text-foreground text-sm">
                      {Array.isArray(nextOrder.order_items?.[0]?.products) 
                        ? nextOrder.order_items[0].products[0]?.name 
                        : (nextOrder.order_items?.[0]?.products as any)?.name || '5-Gallon Purified Water'}
                    </span>
                  </div>

                  <div className="flex items-start justify-between pt-3">
                    <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                      <MapPin className="size-3.5" /> Destination
                    </span>
                    <span className="text-xs text-foreground font-medium text-right max-w-[260px]">
                      {(nextOrder as any)?.delivery_address?.includes('|') 
                        ? (nextOrder as any).delivery_address.split('|')[1] 
                        : ((nextOrder as any)?.delivery_address || 'Registered Address')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3">
                    <span className="text-xs text-muted-foreground font-medium">Total Balance</span>
                    <span className="font-mono text-xl font-bold tabular-nums text-foreground">
                      ₱{nextOrder.total_amount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-border/60">
                  <span className="text-xs text-muted-foreground">
                    Expected fulfillment by our assigned station courier
                  </span>
                  <Link 
                    href="/customer/orders" 
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    View order history
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <Droplets className="size-6" />
                </div>
                <h4 className="font-semibold text-base text-foreground">No active deliveries</h4>
                <p className="text-xs text-muted-foreground mt-1 max-w-[260px]">
                  Your hydration supply is up to date. Place an order whenever you need a refill.
                </p>
                <div className="mt-5">
                  <CustomerCreateOrderDialog trigger={
                    <button className="tactile-btn inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 cursor-pointer">
                      <Plus className="size-3.5" />
                      Place New Order
                    </button>
                  } />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Panel (Tactile UIverse / Mobbin cards) */}
        <div className="space-y-4 lg:col-span-3">
          <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs">
            <h2 className="text-sm font-semibold tracking-tight text-foreground mb-1">Quick Actions</h2>
            <p className="text-xs text-muted-foreground mb-4">Fast shortcuts for your hydration service</p>

            <div className="flex flex-col gap-2.5">
              <CustomerCreateOrderDialog trigger={
                <button className="tactile-btn group relative flex h-14 w-full items-center justify-start gap-3.5 rounded-lg border border-border/70 bg-background px-4 py-2.5 text-sm font-medium transition-all hover:bg-muted/50 hover:border-primary/40 cursor-pointer">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <ShoppingCart className="size-4" />
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-semibold text-foreground">Order Water Refill</span>
                    <span className="block text-[11px] text-muted-foreground">Standard 5-gal or bottle packs</span>
                  </div>
                  <ArrowRightCircle className="size-4 ml-auto text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </button>
              } />
              
              <Link 
                href="/customer/invoices" 
                className="tactile-btn group relative flex h-14 w-full items-center justify-start gap-3.5 rounded-lg border border-border/70 bg-background px-4 py-2.5 text-sm font-medium transition-all hover:bg-muted/50 hover:border-primary/40"
              >
                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Receipt className="size-4" />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-semibold text-foreground">Pay & View Invoices</span>
                  <span className="block text-[11px] text-muted-foreground">Download receipts & settlements</span>
                </div>
                <ArrowRightCircle className="size-4 ml-auto text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>

              <Link 
                href="/customer/profile" 
                className="tactile-btn group relative flex h-14 w-full items-center justify-start gap-3.5 rounded-lg border border-border/70 bg-background px-4 py-2.5 text-sm font-medium transition-all hover:bg-muted/50 hover:border-primary/40"
              >
                <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <MapPin className="size-4" />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-semibold text-foreground">Delivery Address</span>
                  <span className="block text-[11px] text-muted-foreground">Update coordinates & street pin</span>
                </div>
                <ArrowRightCircle className="size-4 ml-auto text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            </div>
          </div>

          {/* Clean Station Contact Card */}
          <div className="rounded-xl border border-border/80 bg-muted/20 p-4 text-xs">
            <div className="flex items-center gap-2 font-medium text-foreground mb-1">
              <Phone className="size-3.5 text-primary" />
              <span>Station Hotline Support</span>
            </div>
            <p className="text-muted-foreground">
              Questions regarding delivery arrival or water container exchange? Our dispatch team is on standby.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
