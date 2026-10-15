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
import { recordPayment } from '@/lib/actions/payments'
import { getPendingOrders } from '@/lib/actions/orders'
import { toast } from 'sonner'

type Order = { id: string; delivery_address: string; total_amount: number }

export function RecordPaymentDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  
  const [selectedOrder, setSelectedOrder] = useState('')

  useEffect(() => {
    if (open) {
      getPendingOrders().then((result) => {
        if (result.data) setOrders(result.data as Order[])
      })
    }
  }, [open])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.set('order_id', selectedOrder)
    
    const result = await recordPayment(formData)

    setLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Payment recorded successfully.')
      setOpen(false)
      setSelectedOrder('')
      router.refresh()
    }
  }

  // Pre-fill amount if an order is selected
  const selectedOrderAmount = orders.find(o => o.id === selectedOrder)?.total_amount || 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2" />}>
        <Plus className="size-4" />
        Record Payment
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>
            Manually log a payment received for an order.
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
                      {o.id.slice(0, 8).toUpperCase()} - ₱{o.total_amount.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₱)</Label>
            <Input 
              id="amount" 
              name="amount" 
              type="number" 
              step="0.01" 
              min={0}
              required 
              defaultValue={selectedOrderAmount > 0 ? selectedOrderAmount : ''}
              key={selectedOrder} // Re-render default value when order changes
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="provider">Payment Provider</Label>
            <Select name="provider" defaultValue="cash">
              <SelectTrigger>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="paymongo">PayMongo (Online)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !selectedOrder}
          >
            {loading ? 'Recording...' : 'Record Payment'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
