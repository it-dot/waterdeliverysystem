import { Calendar, User } from "lucide-react"
import { getSchedules } from "@/lib/services/schedules/schedules.service"
import { CreateScheduleDialog } from "@/components/admin/create-schedule-dialog"
import { ScheduleActions } from "@/components/admin/schedule-actions"

export default async function SchedulesPage() {
  const { data: schedules, error } = await getSchedules()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Delivery Schedules</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage automated recurring delivery schedules and standing customer orders.
          </p>
        </div>
        <CreateScheduleDialog />
      </div>

      <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
        {error ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
             <h3 className="font-semibold text-sm text-red-600">Error loading schedules</h3>
             <p className="text-muted-foreground text-xs mt-1 max-w-sm">
               Please check your database connection.
             </p>
           </div>
        ) : !schedules || schedules.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted/60 mb-3">
              <Calendar className="size-6 text-muted-foreground opacity-50" />
            </div>
            <h3 className="font-semibold text-sm text-foreground">No schedules planned</h3>
            <p className="text-muted-foreground text-xs mt-1 max-w-sm">
              Create recurring or one-time delivery schedules for automatic fulfillment.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4 text-center">Qty</th>
                  <th className="py-3 px-4">Frequency</th>
                  <th className="py-3 px-4">Next Delivery</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {schedules.map((s: any) => {
                  const customerName = s.profiles?.full_name || 'Customer'
                  const initials = customerName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
                  const status = s.status?.toLowerCase()
                  const statusConfig = 
                    status === 'active' ? { dot: 'bg-emerald-500', pill: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' } :
                    status === 'paused' ? { dot: 'bg-amber-500', pill: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20' } :
                    { dot: 'bg-red-500', pill: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20' }

                  return (
                    <tr key={s.id} className="transition-colors hover:bg-muted/40">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary shrink-0">
                            {initials || "CU"}
                          </div>
                          <span className="text-sm font-medium text-foreground">{customerName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-sm text-foreground">
                        {s.products?.name || 'Water Gallon Item'}
                      </td>
                      <td className="py-3.5 px-4 text-sm text-center font-mono font-medium tabular-nums text-foreground">
                        {s.quantity}
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        <span className="capitalize px-2 py-0.5 rounded bg-muted/60 border border-border/50 text-foreground font-medium">
                          {s.frequency}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-muted-foreground">
                        {new Date(s.next_delivery_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${statusConfig.pill}`}>
                          <span className={`size-1.5 rounded-full ${statusConfig.dot}`} />
                          {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <ScheduleActions scheduleId={s.id} status={s.status} />
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
