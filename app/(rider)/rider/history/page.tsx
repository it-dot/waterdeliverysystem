import { CheckCircle2, XCircle, MapPin, Package, ArrowUpRight } from "lucide-react"
import { getRiderCompletedDeliveries } from "@/lib/actions/rider"

export default async function RiderHistoryPage() {
  const { data: deliveries, error } = await getRiderCompletedDeliveries()

  const safeDeliveries = deliveries || []
  const deliveredCount = safeDeliveries.filter((d: any) => d.status === 'delivered').length
  const totalAmount = safeDeliveries
    .filter((d: any) => d.status === 'delivered')
    .reduce((sum: number, d: any) => sum + (d.orders?.total_amount || 0), 0)

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Delivery History
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Complete record of fulfilled and completed drops assigned to your route.
          </p>
        </div>

        {safeDeliveries.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-border/80 bg-card px-3.5 py-1.5 shadow-xs text-xs">
              <span className="text-muted-foreground">Total Delivered: </span>
              <strong className="text-foreground">{deliveredCount} drops</strong>
            </div>
            <div className="rounded-xl border border-border/80 bg-card px-3.5 py-1.5 shadow-xs text-xs">
              <span className="text-muted-foreground">Total Settled: </span>
              <strong className="text-foreground font-mono">₱{totalAmount.toFixed(2)}</strong>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
        {error ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <h3 className="font-semibold text-sm text-red-600">Error loading delivery history</h3>
            <p className="text-muted-foreground text-xs mt-1 max-w-sm">
              Please check your connection and reload the page.
            </p>
          </div>
        ) : safeDeliveries.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-14 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted/60 mb-3">
              <CheckCircle2 className="size-6 text-muted-foreground/60" />
            </div>
            <h3 className="font-semibold text-sm text-foreground">No completed deliveries yet</h3>
            <p className="text-muted-foreground text-xs mt-1 max-w-sm">
              Deliveries you fulfill on your route today will appear here along with payment collection records.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Cards View (< md) */}
            <div className="divide-y divide-border/60 md:hidden">
              {safeDeliveries.map((d: any) => (
                <div key={d.id} className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm text-foreground">
                      {d.orders?.profiles?.full_name || 'Customer'}
                    </span>
                    {d.status === 'delivered' ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        Delivered
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:text-red-400 border border-red-500/20">
                        <span className="size-1.5 rounded-full bg-red-500" />
                        Failed
                      </span>
                    )}
                  </div>
                  <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="size-3.5 text-primary shrink-0 mt-0.5" />
                    <span className="line-clamp-2">
                      {d.orders?.delivery_address?.includes('|') ? d.orders.delivery_address.split('|')[1] : (d.orders?.delivery_address || 'N/A')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-border/40">
                    <span className="font-semibold text-foreground">
                      ₱{d.orders?.total_amount?.toFixed(2) || '0.00'}
                      <span className="text-muted-foreground font-normal ml-1.5 text-[11px]">
                        ({d.orders?.payment_method || 'COD'})
                      </span>
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {d.completed_at ? new Date(d.completed_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Address</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Completed At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {safeDeliveries.map((d: any) => (
                    <tr key={d.id} className="transition-colors hover:bg-muted/30">
                      <td className="py-3.5 px-4 text-sm font-medium text-foreground">
                        {d.orders?.profiles?.full_name || 'Customer'}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-muted-foreground max-w-[260px] truncate">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="size-3 text-muted-foreground shrink-0" />
                          {d.orders?.delivery_address?.includes('|') ? d.orders.delivery_address.split('|')[1] : (d.orders?.delivery_address || 'N/A')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-sm text-right font-semibold tabular-nums text-foreground">
                        ₱{d.orders?.total_amount?.toFixed(2) || '0.00'}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-muted-foreground capitalize">
                        {d.orders?.payment_method || 'COD'}
                      </td>
                      <td className="py-3.5 px-4">
                        {d.status === 'delivered' ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            Delivered
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:text-red-400 border border-red-500/20">
                            <span className="size-1.5 rounded-full bg-red-500" />
                            Failed
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-muted-foreground">
                        {d.completed_at
                          ? new Date(d.completed_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                          : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
