import { Search, MapPin, Truck, AlertCircle } from "lucide-react"
import { getDeliveries } from "@/lib/services/deliveries/deliveries.service"

import { AssignDeliveryDialog } from "@/components/admin/assign-delivery-dialog"
import { DeliveriesView } from "@/components/admin/deliveries-view"

export default async function DeliveriesPage() {
  const { data: deliveries, error } = await getDeliveries()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Delivery Dispatch & Routes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Assign orders to couriers, monitor active transit routes, and track fulfillment status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AssignDeliveryDialog />
        </div>
      </div>

      <div className="mt-6">
        {error ? (
          <div className="rounded-xl border bg-card shadow-sm flex flex-col items-center justify-center p-12 text-center">
            <h3 className="font-semibold text-lg text-red-600">Error loading deliveries</h3>
            <p className="text-muted-foreground text-sm mt-1 max-w-sm">
              Please check your database connection.
            </p>
          </div>
        ) : !deliveries || deliveries.length === 0 ? (
          <div className="rounded-xl border bg-card shadow-sm flex flex-col items-center justify-center p-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted/50 mb-4">
              <Truck className="size-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg">No active deliveries</h3>
            <p className="text-muted-foreground text-sm mt-1 max-w-sm">
              All assigned deliveries have been completed or there are no ongoing deliveries at the moment.
            </p>
          </div>
        ) : (
          <DeliveriesView deliveries={deliveries} />
        )}
      </div>
    </div>
  )
}
