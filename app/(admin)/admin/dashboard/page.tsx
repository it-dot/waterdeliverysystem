import {
  ClipboardList,
  Truck,
  Users,
  DollarSign,
  Clock,
  AlertCircle,
  TrendingUp,
  Activity,
  Package,
  ArrowRight,
  ExternalLink,
} from "lucide-react"
import { getRecentOrders, getDashboardStats } from "@/lib/services/orders/orders.service"
import { PeriodPerformanceCard } from "@/components/admin/period-performance-card"
import { CreateOrderDialog } from "@/components/admin/create-order-dialog"
import Link from "next/link"
import Image from "next/image"

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  trend,
}: {
  title: string
  value: string | number
  change: string
  icon: React.ComponentType<{ className?: string }>
  trend: "up" | "down" | "neutral"
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border/80 bg-card p-5 shadow-xs transition-all duration-200 hover:border-border hover:shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/15">
          <Icon className="size-4" />
        </div>
      </div>
      
      <div className="mt-4 flex flex-col gap-1.5">
        <h3 className="text-3xl font-bold tracking-tight text-foreground font-mono tabular-nums">{value}</h3>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border ${
            trend === "up"
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
              : trend === "down"
              ? "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
              : "bg-muted text-muted-foreground border-border/60"
          }`}>
            {trend === "up" ? (
              <TrendingUp className="size-3" />
            ) : trend === "down" ? (
              <TrendingUp className="size-3 rotate-180" />
            ) : (
              <Activity className="size-3" />
            )}
            {change}
          </span>
        </div>
      </div>
    </div>
  )
}

function RecentOrderRow({
  id,
  customer,
  product,
  status,
  amount,
  date,
}: {
  id: string
  customer: string
  product: string
  status: string
  amount: number
  date: string
}) {
  const statusLower = status.toLowerCase()
  const statusConfig = 
    statusLower === 'delivered' ? { dot: 'bg-emerald-500', pill: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' } :
    statusLower === 'in-transit' ? { dot: 'bg-blue-500', pill: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20' } :
    statusLower === 'pending' ? { dot: 'bg-amber-500', pill: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20' } :
    statusLower === 'processing' ? { dot: 'bg-purple-500', pill: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20' } :
    { dot: 'bg-red-500', pill: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20' }

  const initials = customer.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <tr className="border-b border-border/60 last:border-0 transition-colors hover:bg-muted/40">
      <td className="py-3 px-4 text-xs font-medium">
        <span className="font-mono text-xs px-2 py-0.5 rounded bg-muted/60 border border-border/60 text-foreground font-semibold">
          #{id.slice(0, 8).toUpperCase()}
        </span>
      </td>
      <td className="py-3 px-4 text-sm font-medium">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
            {initials || "CU"}
          </div>
          <span className="text-foreground">{customer}</span>
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-muted-foreground">{product}</td>
      <td className="py-3 px-4">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${statusConfig.pill}`}>
          <span className={`size-1.5 rounded-full ${statusConfig.dot}`} />
          {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
        </span>
      </td>
      <td className="py-3 px-4 text-sm text-right font-mono font-medium tabular-nums text-foreground">
        ₱{amount.toFixed(2)}
      </td>
      <td className="py-3 px-4 text-xs text-muted-foreground">
        {new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
      </td>
    </tr>
  )
}

export default async function DashboardPage() {
  const [ordersRes, statsRes] = await Promise.all([
    getRecentOrders(6),
    getDashboardStats()
  ])

  const { data: recentOrders, error: ordersError } = ordersRes
  const stats = statsRes

  return (
    <div className="space-y-6">
      {/* Top Header / Hero */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Operations Dashboard
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Telemetry
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time water delivery operations, active dispatch routes, and revenue tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-lg border border-border/60 font-medium">
            <Clock className="size-3.5" />
            {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
          <CreateOrderDialog />
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          change="+12% vs last month"
          icon={ClipboardList}
          trend="up"
        />
        <StatCard
          title="Active Deliveries"
          value={stats.activeDeliveries}
          change="3 arriving soon"
          icon={Truck}
          trend="neutral"
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          change="+4 this week"
          icon={Users}
          trend="up"
        />
        <StatCard
          title="Total Revenue"
          value={`₱${stats.revenue.toLocaleString()}`}
          change="All settlements"
          icon={DollarSign}
          trend="up"
        />
      </div>

      {/* Main Grid: Orders Table (4/7) + Operations & Inventory (3/7) */}
      <div className="grid gap-6 lg:grid-cols-7 items-start">
        {/* Recent orders table */}
        <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden lg:col-span-4 flex flex-col">
          <div className="flex items-center justify-between border-b border-border/70 p-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold tracking-tight text-foreground">Recent Orders</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                  Latest 6
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Customer transactions updated live</p>
            </div>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              View all
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto flex-1">
            {ordersError ? (
              <div className="flex h-full min-h-[260px] flex-col items-center justify-center space-y-2 p-8 text-center text-sm text-red-500">
                <AlertCircle className="size-8 opacity-50" />
                <p>Failed to load orders.</p>
              </div>
            ) : !recentOrders || recentOrders.length === 0 ? (
              <div className="flex h-full min-h-[260px] flex-col items-center justify-center space-y-3 p-8 text-center">
                <div className="rounded-full bg-muted p-4">
                  <Package className="size-8 text-muted-foreground opacity-50" />
                </div>
                <div>
                  <p className="font-medium text-sm">No recent orders</p>
                  <p className="text-xs text-muted-foreground mt-0.5">New customer orders will appear here.</p>
                </div>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="py-2.5 px-4">Ref</th>
                    <th className="py-2.5 px-4">Customer</th>
                    <th className="py-2.5 px-4">Product</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4 text-right">Amount</th>
                    <th className="py-2.5 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {recentOrders.map((order: any) => (
                    <RecentOrderRow
                      key={order.id}
                      id={order.id}
                      customer={order.profiles?.full_name || 'Unknown'}
                      product={order.order_items?.[0]?.products?.name || 'Water Gallon'}
                      status={order.status}
                      amount={order.total_amount}
                      date={order.created_at}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Performance Hub & Inventory Alerts */}
        <div className="space-y-6 lg:col-span-3">
          {/* Station Bottling & Inventory Hub Visual Card */}
          <div className="relative overflow-hidden rounded-xl border border-border/80 bg-card shadow-xs group">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
              <Image
                src="/images/admin_dashboard_banner.jpg"
                alt="Clearwell centralized water purification and pallet inventory warehouse"
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider bg-black/60 px-2 py-0.5 rounded text-white/90 backdrop-blur-xs">
                    Station 01 Fulfillment Hub
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white leading-tight drop-shadow-xs">
                  Automated Bottling & Pallet Staging
                </h3>
                <p className="text-[11px] text-white/80 line-clamp-1 mt-0.5 font-mono">
                  All 19L carboy racks stocked · Active route departures
                </p>
              </div>
            </div>
            <div className="p-3 bg-card border-t border-border/60 flex items-center justify-between text-xs">
              <span className="font-mono text-[11px] text-muted-foreground">Pallet Rows A–D Active</span>
              <Link
                href="/admin/inventory"
                className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
              >
                <span>Manage Stock</span>
                <ExternalLink className="size-3" />
              </Link>
            </div>
          </div>

          {/* Interactive Period Performance Card */}
          <PeriodPerformanceCard summaries={stats.summaries} />

          {/* Inventory Alerts Card */}
          <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/70 p-5">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <AlertCircle className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Inventory Stock Alerts</h3>
                  <p className="text-xs text-muted-foreground">Items nearing replenishment threshold</p>
                </div>
              </div>
              <Link
                href="/admin/inventory"
                className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
              >
                Inventory
                <ExternalLink className="size-3" />
              </Link>
            </div>

            <div className="divide-y divide-border/60">
              {stats.inventoryAlerts && stats.inventoryAlerts.length > 0 ? (
                stats.inventoryAlerts.map((alert: any, idx: number) => (
                  <div key={idx} className="p-4 flex items-center justify-between transition-colors hover:bg-muted/40">
                    <div className="flex items-center gap-2.5">
                      <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
                      <div>
                        <span className="text-sm font-medium text-foreground">{alert.name}</span>
                        <p className="text-xs text-muted-foreground">Threshold: {alert.low_stock_threshold || 10} units</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center rounded-md bg-red-500/10 px-2 py-1 text-xs font-mono font-medium text-red-700 dark:text-red-400 border border-red-500/20">
                      {alert.stock_level} in stock
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="rounded-full bg-emerald-500/10 p-3 mb-2 text-emerald-600 dark:text-emerald-400">
                    <Activity className="size-5" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Stock levels healthy</p>
                  <p className="text-xs text-muted-foreground mt-0.5">No products require urgent restocking.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
