'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createDelivery } from '@/lib/actions/deliveries'
import { getPendingOrders } from '@/lib/actions/orders'
import { getRiders } from '@/lib/actions/customers'
import { toast } from 'sonner'

type Order = { id: string; delivery_address: string; total_amount: number }
type Rider = { id: string; full_name: string | null }

export function AssignDeliveryDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [riders, setRiders] = useState<Rider[]>([])
  
  const [selectedOrder, setSelectedOrder] = useState('')
  const [selectedRider, setSelectedRider] = useState('')

  useEffect(() => {
    if (open) {
      getPendingOrders().then((result) => {
        if (result.data) setOrders(result.data as Order[])
      })
      getRiders().then((result) => {
        if (result.data) setRiders(result.data as Rider[])
      })
    }
  }, [open])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.set('order_id', selectedOrder)
    formData.set('rider_id', selectedRider)
    
    const result = await createDelivery(formData)

    setLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Delivery assigned successfully.')
      setOpen(false)
      setSelectedOrder('')
      setSelectedRider('')
      router.refresh()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2" />}>
        <Plus className="size-4" />
        Assign Delivery
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign New Delivery</DialogTitle>
          <DialogDescription>
            Assign an order to a rider for delivery.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Pending Order</Label>
            {orders.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">
                No pending orders found.
              </p>
            ) : (
              <Select value={selectedOrder} onValueChange={(v) => setSelectedOrder(v ?? '')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an order" />
                </SelectTrigger>
                <SelectContent>
                  {orders.map((o) => (
                    <SelectItem key={o.id} value={o.id}>
                      {o.id.slice(0, 8).toUpperCase()} - {o.delivery_address?.includes('|') ? o.delivery_address.split('|')[1] : o.delivery_address}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          
          <div className="space-y-2">
            <Label>Assign Rider (Optional)</Label>
            {riders.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">
                No riders found. You can assign one later.
              </p>
            ) : (
              <Select value={selectedRider} onValueChange={(v) => setSelectedRider(v ?? '')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a rider" />
                </SelectTrigger>
                <SelectContent>
                  {riders.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.full_name || 'Unnamed Rider'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="scheduled_date">Scheduled Date (Optional)</Label>
            <Input id="scheduled_date" name="scheduled_date" type="datetime-local" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" name="notes" placeholder="Delivery instructions..." />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !selectedOrder}
          >
            {loading ? 'Assigning...' : 'Assign Delivery'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
