'use client'

import { useState } from 'react'
import { markDeliveryStatus } from '@/lib/actions/rider'
import { toast } from 'sonner'
import { Navigation, CheckCircle, XCircle, Loader2, MapPinned } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DeliveryActions({ deliveryId, status, address }: { deliveryId: string; status: string; address?: string }) {
  const [loading, setLoading] = useState<string | null>(null)

  let mapsUrl = ""
  if (address && address.includes('|')) {
    const coords = address.split('|')[0]
    mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords}&travelmode=driving`
  }

  async function handleStatusUpdate(newStatus: 'in-transit' | 'delivered' | 'failed') {
    setLoading(newStatus)
    const result = await markDeliveryStatus(deliveryId, newStatus)
    setLoading(null)

    if (result.error) {
      toast.error(result.error)
    } else {
      const messages: Record<string, string> = {
        'in-transit': 'You are now en route!',
        'delivered': 'Delivery marked as completed!',
        'failed': 'Delivery marked as failed.',
      }
      toast.success(messages[newStatus])
    }
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {status === 'assigned' && (
        <Button
          size="sm"
          className="gap-1.5 bg-blue-600 hover:bg-blue-700"
          onClick={() => handleStatusUpdate('in-transit')}
          disabled={loading !== null}
        >
          {loading === 'in-transit' ? <Loader2 className="size-3.5 animate-spin" /> : <Navigation className="size-3.5" />}
          Start Delivery
        </Button>
      )}
      {(status === 'assigned' || status === 'in-transit') && (
        <>
          {mapsUrl && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-blue-600 border-blue-200 hover:bg-blue-50"
              onClick={() => window.open(mapsUrl, '_blank')}
            >
              <MapPinned className="size-3.5" />
              GPS Route
            </Button>
          )}
          <Button
            size="sm"
            className="gap-1.5 bg-emerald-600 hover:bg-emerald-700"
            onClick={() => handleStatusUpdate('delivered')}
            disabled={loading !== null}
          >
            {loading === 'delivered' ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCircle className="size-3.5" />}
            Mark Delivered
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50"
            onClick={() => handleStatusUpdate('failed')}
            disabled={loading !== null}
          >
            {loading === 'failed' ? <Loader2 className="size-3.5 animate-spin" /> : <XCircle className="size-3.5" />}
            Failed
          </Button>
        </>
      )}
    </div>
  )
}
