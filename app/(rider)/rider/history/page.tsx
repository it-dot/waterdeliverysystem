import { CheckCircle, XCircle, MapPin } from "lucide-react"
import { getRiderCompletedDeliveries } from "@/lib/actions/rider"

export default async function RiderHistoryPage() {
  const { data: deliveries, error } = await getRiderCompletedDeliveries()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Delivery History</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Complete record of fulfilled and attempted drops assigned to your route.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
        {error ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <h3 className="font-semibold text-sm text-red-600">Error loading history</h3>
            <p className="text-muted-foreground text-xs mt-1 max-w-sm">
              Please check your connection and try again.
            </p>
          </div>
        ) : !deliveries || deliveries.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted/60 mb-3">
              <CheckCircle className="size-6 text-muted-foreground opacity-50" />
            </div>
            <h3 className="font-semibold text-sm text-foreground">No completed deliveries</h3>
            <p className="text-muted-foreground text-xs mt-1 max-w-sm">
              Your fulfilled drops and delivery completions will appear here.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Cards View (< md) */}
            <div className="divide-y divide-border/60 md:hidden">
              {deliveries.map((d: any) => (
                <div key={d.id} className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm text-foreground">
                      {d.orders?.profiles?.full_name || 'Customer'}
                    </span>
                    {d.status === 'delivered' ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        Delivered
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-0.5 text-[11px] font-medium text-red-700 dark:text-red-400 border border-red-500/20">
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
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-border/40">
                    <span className="font-mono font-bold text-foreground">
                      ₱{d.orders?.total_amount?.toFixed(2) || '0.00'}
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
                  <tr className="border-b border-border/60 bg-muted/30 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Address</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Completed At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {deliveries.map((d: any) => (
                    <tr key={d.id} className="transition-colors hover:bg-muted/40">
                      <td className="py-3.5 px-4 text-sm font-medium text-foreground">
                        {d.orders?.profiles?.full_name || 'Customer'}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-muted-foreground max-w-[240px] truncate">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="size-3 text-muted-foreground shrink-0" />
                          {d.orders?.delivery_address?.includes('|') ? d.orders.delivery_address.split('|')[1] : (d.orders?.delivery_address || 'N/A')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-sm text-right font-mono font-medium tabular-nums text-foreground">
                        ₱{d.orders?.total_amount?.toFixed(2) || '0.00'}
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
                          ? new Date(d.completed_at).toLocaleString()
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
