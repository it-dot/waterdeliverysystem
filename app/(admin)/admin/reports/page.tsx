import { BarChart3, TrendingUp, Truck, Package, DollarSign, ShoppingCart, AlertTriangle, CheckCircle } from "lucide-react"
import { getSalesReport, getDeliveryReport, getInventoryReport } from "@/lib/services/reports/reports.service"
import { DownloadReportButton } from "@/components/admin/download-report-button"
import Link from "next/link"

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ timeframe?: string }>
}) {
  const params = await searchParams;
  const timeframe = (params.timeframe as 'daily' | 'weekly' | 'monthly' | 'yearly') || 'daily'

  const [sales, delivery, inventory] = await Promise.all([
    getSalesReport(timeframe),
    getDeliveryReport(timeframe),
    getInventoryReport(),
  ])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Analyze delivery performance, sales volume, and export verified audit reports.
          </p>
        </div>
        
        {/* Segmented Timeframe Switcher */}
        <div className="inline-flex rounded-lg border border-border/80 bg-muted/50 p-1">
          {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((period) => (
            <Link
              key={period}
              href={`?timeframe=${period}`}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all capitalize ${
                timeframe === period
                  ? 'bg-background shadow-xs text-foreground font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {period}
            </Link>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs transition-all duration-200 hover:border-border hover:shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Revenue</p>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="size-4" />
            </div>
          </div>
          <h3 className="mt-3 text-2xl font-bold font-mono tabular-nums text-foreground">
            ₱{sales.totalRevenue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 capitalize">{timeframe} collection total</p>
        </div>
        
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs transition-all duration-200 hover:border-border hover:shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Orders</p>
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <ShoppingCart className="size-4" />
            </div>
          </div>
          <h3 className="mt-3 text-2xl font-bold font-mono tabular-nums text-foreground">
            {sales.totalOrders}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">Processed transactions</p>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs transition-all duration-200 hover:border-border hover:shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Delivery Success</p>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="size-4" />
            </div>
          </div>
          <h3 className="mt-3 text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
            {delivery.successRate}%
          </h3>
          <p className="text-xs text-muted-foreground mt-1">Successful completions</p>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs transition-all duration-200 hover:border-border hover:shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stock Valuation</p>
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Package className="size-4" />
            </div>
          </div>
          <h3 className="mt-3 text-2xl font-bold font-mono tabular-nums text-foreground">
            ₱{inventory.totalStockValue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">{inventory.totalItems} product lines</p>
        </div>
      </div>

      {/* Report Action Panels */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Sales Report */}
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs flex flex-col justify-between gap-5 transition-all duration-200 hover:border-border hover:shadow-sm">
          <div>
            <div className="flex items-center gap-3 pb-3 border-b border-border/60">
              <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="size-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Sales & Revenue</h3>
                <p className="text-xs text-muted-foreground">Orders, payments, and gross receipts</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mt-4 text-xs">
              <div className="rounded-lg bg-muted/40 p-3 border border-border/50">
                <p className="text-[11px] text-muted-foreground capitalize">{timeframe} Orders</p>
                <p className="text-base font-bold font-mono tabular-nums text-foreground mt-0.5">{sales.periodOrders}</p>
              </div>
              <div className="rounded-lg bg-muted/40 p-3 border border-border/50">
                <p className="text-[11px] text-muted-foreground capitalize">{timeframe} Revenue</p>
                <p className="text-base font-bold font-mono tabular-nums text-foreground mt-0.5">₱{sales.periodRevenue.toFixed(2)}</p>
              </div>
              <div className="rounded-lg bg-muted/40 p-3 border border-border/50">
                <p className="text-[11px] text-muted-foreground">Completed</p>
                <p className="text-base font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-0.5">{sales.completedOrders}</p>
              </div>
              <div className="rounded-lg bg-muted/40 p-3 border border-border/50">
                <p className="text-[11px] text-muted-foreground">Cancelled</p>
                <p className="text-base font-bold font-mono tabular-nums text-red-600 dark:text-red-400 mt-0.5">{sales.cancelledOrders}</p>
              </div>
            </div>
          </div>
          
          <DownloadReportButton reportType="sales" data={sales} />
        </div>

        {/* Delivery Report */}
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs flex flex-col justify-between gap-5 transition-all duration-200 hover:border-border hover:shadow-sm">
          <div>
            <div className="flex items-center gap-3 pb-3 border-b border-border/60">
              <div className="flex size-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Truck className="size-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Delivery Performance</h3>
                <p className="text-xs text-muted-foreground">Fulfillment rates and drop outcomes</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mt-4 text-xs">
              <div className="rounded-lg bg-muted/40 p-3 border border-border/50">
                <p className="text-[11px] text-muted-foreground">Total Assigned</p>
                <p className="text-base font-bold font-mono tabular-nums text-foreground mt-0.5">{delivery.totalDeliveries}</p>
              </div>
              <div className="rounded-lg bg-muted/40 p-3 border border-border/50">
                <p className="text-[11px] text-muted-foreground">Delivered</p>
                <p className="text-base font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-0.5">{delivery.completedDeliveries}</p>
              </div>
              <div className="rounded-lg bg-muted/40 p-3 border border-border/50">
                <p className="text-[11px] text-muted-foreground">In Transit</p>
                <p className="text-base font-bold font-mono tabular-nums text-blue-600 dark:text-blue-400 mt-0.5">{delivery.inTransit}</p>
              </div>
              <div className="rounded-lg bg-muted/40 p-3 border border-border/50">
                <p className="text-[11px] text-muted-foreground">Failed Drops</p>
                <p className="text-base font-bold font-mono tabular-nums text-red-600 dark:text-red-400 mt-0.5">{delivery.failed}</p>
              </div>
            </div>
          </div>

          <DownloadReportButton reportType="delivery" data={delivery} />
        </div>

        {/* Inventory Report */}
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs flex flex-col justify-between gap-5 transition-all duration-200 hover:border-border hover:shadow-sm">
          <div>
            <div className="flex items-center gap-3 pb-3 border-b border-border/60">
              <div className="flex size-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Package className="size-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Inventory Audit</h3>
                <p className="text-xs text-muted-foreground">Valuation, depleted, & low stock items</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mt-4 text-xs">
              <div className="rounded-lg bg-muted/40 p-3 border border-border/50">
                <p className="text-[11px] text-muted-foreground">Catalog Lines</p>
                <p className="text-base font-bold font-mono tabular-nums text-foreground mt-0.5">{inventory.totalItems}</p>
              </div>
              <div className="rounded-lg bg-muted/40 p-3 border border-border/50">
                <p className="text-[11px] text-muted-foreground">Stock Value</p>
                <p className="text-base font-bold font-mono tabular-nums text-foreground mt-0.5">₱{inventory.totalStockValue.toFixed(2)}</p>
              </div>
              <div className="rounded-lg bg-muted/40 p-3 border border-border/50">
                <p className="text-[11px] text-muted-foreground">Low Stock</p>
                <p className="text-base font-bold font-mono tabular-nums text-amber-600 dark:text-amber-400 mt-0.5">{inventory.lowStock}</p>
              </div>
              <div className="rounded-lg bg-muted/40 p-3 border border-border/50">
                <p className="text-[11px] text-muted-foreground">Out of Stock</p>
                <p className="text-base font-bold font-mono tabular-nums text-red-600 dark:text-red-400 mt-0.5">{inventory.outOfStock}</p>
              </div>
            </div>
          </div>

          <DownloadReportButton reportType="inventory" data={inventory} />
        </div>
      </div>
    </div>
  )
}
