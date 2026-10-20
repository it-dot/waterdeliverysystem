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
  Sparkles,
  Layers,
  ArrowUpRight,
  ShieldCheck,
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
  color = "blue",
}: {
  title: string
  value: string | number
  change: string
  icon: React.ComponentType<{ className?: string }>
  trend: "up" | "down" | "neutral"
  color?: "blue" | "cyan" | "emerald" | "purple"
}) {
  const colorStyles = {
    blue: {
      iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      glow: "from-blue-500/5 to-transparent",
    },
    cyan: {
      iconBg: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
      glow: "from-cyan-500/5 to-transparent",
    },
    emerald: {
      iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      glow: "from-emerald-500/5 to-transparent",
    },
    purple: {
      iconBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      glow: "from-purple-500/5 to-transparent",
    },
  }[color]

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md p-5 shadow-xs transition-all duration-300 hover:border-primary/40 hover:shadow-md group">
      {/* Subtle top corner gradient illumination */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${colorStyles.glow} rounded-bl-full pointer-events-none transition-opacity duration-300 group-hover:opacity-100 opacity-60`} />

      <div className="flex items-center justify-between relative z-10">
        <p className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">{title}</p>
        <div className={`flex size-9 items-center justify-center rounded-xl border shadow-xs transition-transform duration-200 group-hover:scale-105 ${colorStyles.iconBg}`}>
          <Icon className="size-4" />
        </div>
      </div>
      
      <div className="mt-4 flex flex-col gap-1 relative z-10">
        <h3 className="text-3xl font-extrabold tracking-tight text-foreground font-mono tabular-nums">{value}</h3>
        <div className="flex items-center gap-1.5 mt-1">
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
            trend === "up"
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
              : trend === "down"
              ? "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
              : "bg-muted/60 text-muted-foreground border-border/70"
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
    statusLower === 'in-transit' ? { dot: 'bg-blue-500 animate-pulse', pill: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20' } :
    statusLower === 'pending' ? { dot: 'bg-amber-500', pill: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20' } :
    statusLower === 'processing' ? { dot: 'bg-purple-500', pill: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20' } :
    { dot: 'bg-red-500', pill: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20' }

  const initials = customer.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <tr className="border-b border-border/60 last:border-0 transition-colors hover:bg-muted/40">
      <td className="py-3 px-4 text-xs font-medium">
        <span className="font-mono text-xs px-2 py-0.5 rounded-lg bg-muted/60 border border-border/70 text-foreground font-bold">
          #{id.slice(0, 8).toUpperCase()}
        </span>
      </td>
      <td className="py-3 px-4 text-sm font-medium">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary border border-primary/20">
            {initials || "CU"}
          </div>
          <span className="text-foreground font-semibold text-xs sm:text-sm">{customer}</span>
        </div>
      </td>
      <td className="py-3 px-4 text-xs sm:text-sm text-muted-foreground">{product}</td>
      <td className="py-3 px-4">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${statusConfig.pill}`}>
          <span className={`size-1.5 rounded-full ${statusConfig.dot}`} />
          {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
        </span>
      </td>
      <td className="py-3 px-4 text-sm text-right font-mono font-bold tabular-nums text-foreground">
        ₱{amount.toFixed(2)}
      </td>
      <td className="py-3 px-4 text-xs text-muted-foreground font-mono">
        {new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
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
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black tracking-tight text-foreground md:text-3xl">
              Station Operations Center
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              Hub 01 Live
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-time water refilling queue, courier telemetry, and automated financial settlements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 px-3.5 py-2 rounded-xl border border-border/60 font-mono">
            <Clock className="size-3.5 text-primary" />
            {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <CreateOrderDialog />
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          change="+12% this month"
          icon={ClipboardList}
          trend="up"
          color="blue"
        />
        <StatCard
          title="Active Deliveries"
          value={stats.activeDeliveries}
          change="3 in transit"
          icon={Truck}
          trend="neutral"
          color="cyan"
        />
        <StatCard
          title="Registered Accounts"
          value={stats.totalCustomers}
          change="+4 this week"
          icon={Users}
          trend="up"
          color="purple"
        />
        <StatCard
          title="Gross Revenue"
          value={`₱${stats.revenue.toLocaleString()}`}
          change="All drops settled"
          icon={DollarSign}
          trend="up"
          color="emerald"
        />
      </div>

      {/* Main Grid: Orders Table (4/7) + Operations & Inventory (3/7) */}
      <div className="grid gap-6 lg:grid-cols-7 items-start">
        {/* Recent orders table */}
        <div className="rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md shadow-xs overflow-hidden lg:col-span-4 flex flex-col">
          <div className="flex items-center justify-between border-b border-border/70 p-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold tracking-tight text-foreground">Recent Orders</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                  Latest 6
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Live customer transactions streaming in real-time</p>
            </div>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline transition-colors"
            >
              View all orders
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
                  <p className="font-semibold text-sm text-foreground">No recent orders</p>
                  <p className="text-xs text-muted-foreground mt-0.5">New customer orders will appear here automatically.</p>
                </div>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30 text-left text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
                    <th className="py-3 px-4">Ref</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {recentOrders.map((order: any) => (
                    <RecentOrderRow
                      key={order.id}
                      id={order.id}
                      customer={order.profiles?.full_name || 'Customer'}
                      product={order.order_items?.[0]?.products?.name || 'Water Gallon Item'}
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
          {/* Station Bottling & Warehouse Staging Card */}
          <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md shadow-xs group">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
              <Image
                src="/images/admin_dashboard_banner.jpg"
                alt="Clearwell centralized water purification and pallet inventory warehouse"
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider bg-black/60 px-2.5 py-0.5 rounded-full text-white/90 backdrop-blur-xs border border-white/20">
                    Station 01 Fulfillment Hub
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white leading-tight drop-shadow-xs">
                  Automated Bottling & Pallet Staging
                </h3>
                <p className="text-[11px] text-white/80 line-clamp-1 mt-0.5 font-mono">
                  All 19L carboy racks stocked · Route dispatch active
                </p>
              </div>
            </div>
            <div className="p-3.5 bg-card border-t border-border/60 flex items-center justify-between text-xs">
              <span className="font-mono text-[11px] text-muted-foreground">Pallet Rows A–D Active</span>
              <Link
                href="/admin/inventory"
                className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
              >
                <span>Manage Inventory</span>
                <ExternalLink className="size-3" />
              </Link>
            </div>
          </div>

          {/* Period Performance Card */}
          <PeriodPerformanceCard summaries={stats.summaries} />

          {/* Inventory Alerts Card */}
          <div className="rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md shadow-xs overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/70 p-5">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <AlertCircle className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Inventory Alerts</h3>
                  <p className="text-xs text-muted-foreground">Threshold tracking</p>
                </div>
              </div>
              <Link
                href="/admin/inventory"
                className="text-xs font-bold text-primary hover:underline transition-colors inline-flex items-center gap-1"
              >
                Full Stock
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
                        <span className="text-sm font-semibold text-foreground">{alert.name}</span>
                        <p className="text-xs text-muted-foreground">Minimum: {alert.low_stock_threshold || 10} units</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center rounded-lg bg-red-500/10 px-2.5 py-1 text-xs font-mono font-bold text-red-700 dark:text-red-400 border border-red-500/20">
                      {alert.stock_level} in stock
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="rounded-full bg-emerald-500/10 p-3 mb-2 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <Activity className="size-5" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">Stock Levels Optimal</p>
                  <p className="text-xs text-muted-foreground mt-0.5">All products are above threshold levels.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
