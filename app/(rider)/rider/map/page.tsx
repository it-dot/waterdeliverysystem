import { Map } from "lucide-react"
import { MapWrapper } from "@/components/map/MapWrapper"
import { getDeliveries } from "@/lib/services/deliveries/deliveries.service"
import { createClient } from "@/lib/supabase/server"

export default async function RiderMapPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: allDeliveries } = await getDeliveries()
  
  // Filter for the logged in rider's assigned deliveries
  const deliveries = (allDeliveries || []).filter(d => d.rider_id === user?.id && (d.status === 'assigned' || d.status === 'in-transit'))

  const locations = deliveries.map((d) => {
    let lat = 8.9475 + (Math.random() - 0.5) * 0.05
    let lng = 125.5406 + (Math.random() - 0.5) * 0.05
    
    const address = d.orders?.delivery_address || ''
    if (address.includes('|')) {
      const [coords] = address.split('|')
      const [parsedLat, parsedLng] = coords.split(',').map(Number)
      if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
        lat = parsedLat
        lng = parsedLng
      }
    }

    return {
      id: d.id,
      lat,
      lng,
      title: `Order: ${d.orders?.id?.slice(0, 8) || 'Unknown'} - Status: ${d.status}`,
      isActiveRoute: d.status === 'in-transit'
    }
  })

  const riderLocation: [number, number] = [8.9475, 125.5406];

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Route Map</h1>
          <p className="text-muted-foreground">
            Optimized route for your deliveries.
          </p>
        </div>
      </div>

      <div className="flex-1 rounded-xl border bg-card shadow-sm overflow-hidden flex flex-col items-center justify-center text-center relative z-0">
         <MapWrapper locations={locations} center={[8.9475, 125.5406]} zoom={12} riderLocation={riderLocation} />
      </div>
    </div>
  )
}
