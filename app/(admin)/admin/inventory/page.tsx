import { Search, Filter, AlertCircle, PackageX } from "lucide-react"
import { getInventory } from "@/lib/services/inventory/inventory.service"

import { AddInventoryDialog } from "@/components/admin/add-inventory-dialog"
import { InventoryActions } from "@/components/admin/inventory-actions"

export default async function InventoryPage() {
  const { data: inventory, error } = await getInventory()

  const totalItems = inventory?.length || 0
  const lowStockCount = inventory?.filter(
    (item) => item.stock_level <= item.low_stock_threshold && item.stock_level > 0
  ).length || 0
  const outOfStockCount = inventory?.filter((item) => item.stock_level === 0).length || 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Inventory Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track water supply stock levels, refill equipment, and restocking thresholds.
          </p>
        </div>
        <AddInventoryDialog />
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs transition-all duration-200 hover:border-border hover:shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product Catalog</p>
          <div className="mt-3 flex items-baseline justify-between">
            <h3 className="text-3xl font-bold font-mono tabular-nums tracking-tight text-foreground">{totalItems}</h3>
            <span className="text-xs text-muted-foreground">Active lines</span>
          </div>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs transition-all duration-200 hover:border-border hover:shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Low Stock Alerts</p>
            <span className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <AlertCircle className="size-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h3 className="text-3xl font-bold font-mono tabular-nums tracking-tight text-amber-600 dark:text-amber-400">{lowStockCount}</h3>
            <span className="text-xs text-muted-foreground">Near threshold</span>
          </div>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs transition-all duration-200 hover:border-border hover:shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Depleted Inventory</p>
            <span className="flex size-7 items-center justify-center rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
              <AlertCircle className="size-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h3 className="text-3xl font-bold font-mono tabular-nums tracking-tight text-red-600 dark:text-red-400">{outOfStockCount}</h3>
            <span className="text-xs text-muted-foreground">Immediate action</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products or equipment..."
            className="h-9 w-full rounded-lg border border-border/80 bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
          />
        </div>
      </div>

      <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
        {error ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <h3 className="font-semibold text-sm text-red-600">Error loading inventory</h3>
            <p className="text-muted-foreground text-xs mt-1 max-w-sm">
              Please check your database connection.
            </p>
          </div>
        ) : !inventory || inventory.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted/60 mb-3">
              <PackageX className="size-6 text-muted-foreground opacity-50" />
            </div>
            <h3 className="font-semibold text-sm text-foreground">Inventory is empty</h3>
            <p className="text-muted-foreground text-xs mt-1 max-w-sm">
              Add products or water supplies to track stock levels.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
             <table className="w-full">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4 text-center">Stock Level</th>
                  <th className="py-3 px-4 text-center">Threshold</th>
                  <th className="py-3 px-4">Last Restocked</th>
                  <th className="py-3 px-4 w-[50px]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {inventory.map((item) => {
                  const isDepleted = item.stock_level === 0
                  const isLow = item.stock_level <= item.low_stock_threshold
                  const statusStyle = isDepleted
                    ? { dot: 'bg-red-500', pill: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20' }
                    : isLow
                    ? { dot: 'bg-amber-500', pill: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20' }
                    : { dot: 'bg-emerald-500', pill: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' }

                  return (
                    <tr key={item.id} className="transition-colors hover:bg-muted/40">
                      <td className="py-3 px-4 text-sm font-medium text-foreground">
                        {item.products?.name || 'Unknown Product'}
                      </td>
                      <td className="py-3 px-4 text-sm text-center">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-mono font-medium border ${statusStyle.pill}`}>
                          <span className={`size-1.5 rounded-full ${statusStyle.dot}`} />
                          {item.stock_level} units
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-center font-mono tabular-nums text-muted-foreground">{item.low_stock_threshold}</td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {item.last_restocked_at ? new Date(item.last_restocked_at).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <InventoryActions 
                          inventoryId={item.id} 
                          productId={item.product_id} 
                          currentStock={item.stock_level}
                          productName={item.products?.name || 'Unknown Product'}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
