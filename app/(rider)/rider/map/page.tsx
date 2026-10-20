import { Map, ArrowLeft, Navigation, ListOrdered } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapWrapper } from "@/components/map/MapWrapper"
import { getDeliveries } from "@/lib/services/deliveries/deliveries.service"
import { createClient } from "@/lib/supabase/server"

export default async function RiderMapPage({
  searchParams,
}: {
  searchParams?: Promise<{ deliveryId?: string }>
}) {
  const params = await searchParams
  const targetDeliveryId = params?.deliveryId

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: allDeliveries } = await getDeliveries()
  
  // Filter for the logged in rider's assigned or in-transit deliveries
  const deliveries = (allDeliveries || []).filter(
    (d) => d.rider_id === user?.id && (d.status === "assigned" || d.status === "in-transit")
  )

  // Determine active delivery: matching param, or in-transit, or first in queue
  const activeDelivery = 
    (targetDeliveryId ? deliveries.find((d) => d.id === targetDeliveryId) : null) ||
    deliveries.find((d) => d.status === "in-transit") ||
    deliveries[0]

  const locations = deliveries.map((d) => {
    let lat = 8.9475
    let lng = 125.5406
    
    const address = d.orders?.delivery_address || ""
    let cleanAddress = address
    if (address.includes("|")) {
      const [coords, ...rest] = address.split("|")
      cleanAddress = rest.join("|")
      const [parsedLat, parsedLng] = coords.split(",").map(Number)
      if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
        lat = parsedLat
        lng = parsedLng
      }
    }

    const isTarget = activeDelivery?.id === d.id
    const order = (d as any).orders

    return {
      id: d.id,
      lat,
      lng,
      title: `${order?.profiles?.full_name || "Customer"} - ${cleanAddress || "Pinned Location"}`,
      customerName: order?.profiles?.full_name || "Customer",
      phone: order?.profiles?.phone || "",
      address: cleanAddress || address || "Address on file",
      rawAddress: address,
      orderId: order?.id || d.id,
      amount: order?.total_amount || 0,
      paymentMethod: order?.payment_method || "Cash on Delivery",
      status: d.status,
      isActiveRoute: isTarget,
    }
  })

  const riderLocation: [number, number] = [8.9475, 125.5406]
  const activeLocation = locations.find((l) => l.id === activeDelivery?.id)

  return (
    <div className="space-y-3 sm:space-y-4 h-[calc(100dvh-7.5rem)] md:h-[calc(100vh-6.5rem)] flex flex-col animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <Link href="/rider/deliveries">
            <Button variant="outline" size="sm" className="h-8 gap-1.5 shadow-xs">
              <ArrowLeft className="size-3.5" />
              <span className="hidden sm:inline">Deliveries</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              <Navigation className="size-5 text-blue-600" />
              Route Map
            </h1>
          </div>
        </div>

        {/* Quick Stop Switcher Pills if rider has deliveries */}
        {deliveries.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap flex items-center gap-1">
              <ListOrdered className="size-3.5" />
              Stops ({deliveries.length}):
            </span>
            {deliveries.map((d, index) => {
              const isSelected = d.id === activeDelivery?.id
              const name = (d as any).orders?.profiles?.full_name || `Stop #${index + 1}`
              return (
                <Link key={d.id} href={`/rider/map?deliveryId=${d.id}`}>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap border ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted border-border/70"
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        isSelected
                          ? "bg-white"
                          : d.status === "in-transit"
                          ? "bg-blue-500 animate-pulse"
                          : "bg-muted-foreground/60"
                      }`}
                    />
                    {name.split(" ")[0]} {d.status === "in-transit" && "⚡"}
                  </span>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      <div className="flex-1 rounded-2xl border border-border/80 bg-card shadow-sm overflow-hidden flex flex-col relative z-0 min-h-[350px]">
        <MapWrapper
          locations={locations}
          center={activeLocation ? [activeLocation.lat, activeLocation.lng] : riderLocation}
          zoom={13}
          riderLocation={riderLocation}
          activeDeliveryId={activeDelivery?.id}
        />
      </div>
    </div>
  )
}
