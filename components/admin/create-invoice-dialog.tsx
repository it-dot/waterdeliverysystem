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
import { createInvoice } from '@/lib/actions/invoices'
import { getCustomerList } from '@/lib/actions/customers'
import { getPendingOrders } from '@/lib/actions/orders'
import { toast } from 'sonner'

type Customer = { id: string; full_name: string; email: string }
type Order = { id: string; delivery_address: string; total_amount: number }

export function CreateInvoiceDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [selectedOrder, setSelectedOrder] = useState('')
  const [useOrder, setUseOrder] = useState(true)

  useEffect(() => {
    if (open) {
      getCustomerList().then((result) => {
        if (result.data) setCustomers(result.data as Customer[])
      })
      getPendingOrders().then((result) => {
        if (result.data) setOrders(result.data as Order[])
      })
    }
  }, [open])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.set('customer_id', selectedCustomer)
    if (useOrder && selectedOrder) {
      formData.set('order_id', selectedOrder)
    }

    const result = await createInvoice(formData)
    setLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Invoice created successfully.')
      setOpen(false)
      setSelectedCustomer('')
      setSelectedOrder('')
      router.refresh()
    }
  }

  const selectedOrderAmount = orders.find(o => o.id === selectedOrder)?.total_amount || 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2" />}>
        <Plus className="size-4" />
        Create Invoice
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Invoice</DialogTitle>
          <DialogDescription>
            Generate a new invoice for a customer.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Customer</Label>
            {customers.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">No customers found.</p>
            ) : (
              <Select value={selectedCustomer} onValueChange={(v) => setSelectedCustomer(v ?? '')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.full_name || c.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Link to Order</Label>
              <button
                type="button"
                className="text-xs text-blue-600 hover:underline"
                onClick={() => setUseOrder(!useOrder)}
              >
                {useOrder ? 'Enter amounts manually' : 'Link to an order'}
              </button>
            </div>
            {useOrder ? (
              orders.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">No pending orders.</p>
              ) : (
                <Select value={selectedOrder} onValueChange={(v) => setSelectedOrder(v ?? '')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an order" />
                  </SelectTrigger>
                  <SelectContent>
                    {orders.map((o) => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.id.slice(0, 8).toUpperCase()} — ₱{o.total_amount.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="subtotal" className="text-xs">Subtotal (₱)</Label>
                  <Input id="subtotal" name="subtotal" type="number" step="0.01" min={0} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="delivery_fee" className="text-xs">Delivery Fee (₱)</Label>
                  <Input id="delivery_fee" name="delivery_fee" type="number" step="0.01" min={0} defaultValue="20" />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="due_date">Due Date</Label>
            <Input id="due_date" name="due_date" type="date" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Input id="notes" name="notes" placeholder="Add a note..." />
          </div>

          {useOrder && selectedOrderAmount > 0 && (
            <div className="rounded-lg bg-muted/50 p-3 text-sm">
              <span className="text-muted-foreground">Invoice Total:</span>{' '}
              <span className="font-semibold">₱{selectedOrderAmount.toFixed(2)}</span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !selectedCustomer || (useOrder && !selectedOrder)}
          >
            {loading ? 'Creating...' : 'Create Invoice'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
