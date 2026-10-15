import { MapPin, Phone, Truck } from "lucide-react"
import { getRiderDeliveries } from "@/lib/actions/rider"
import { RiderDeliveriesTable } from "@/components/rider/deliveries-table"

export default async function RiderDeliveriesPage() {
  const { data: deliveries, error } = await getRiderDeliveries()

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Deliveries</h1>
          <p className="text-muted-foreground">
            All your assigned deliveries.
          </p>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border bg-card shadow-sm flex flex-col items-center justify-center p-12 text-center">
          <h3 className="font-semibold text-lg text-red-600">Error loading deliveries</h3>
          <p className="text-muted-foreground text-sm mt-1 max-w-sm">
            Please check your connection and try again.
          </p>
        </div>
      ) : !deliveries || deliveries.length === 0 ? (
        <div className="rounded-xl border bg-card shadow-sm flex flex-col items-center justify-center p-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted/50 mb-4">
            <Truck className="size-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg">No deliveries assigned</h3>
          <p className="text-muted-foreground text-sm mt-1 max-w-sm">
            You don't have any pending deliveries right now.
          </p>
        </div>
      ) : (
        <RiderDeliveriesTable deliveries={deliveries} />
      )}
    </div>
  )
}
