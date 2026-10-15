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
import { createSchedule } from '@/lib/actions/schedules'
import { getCustomerList } from '@/lib/actions/customers'
import { getProductsList } from '@/lib/actions/inventory'
import { toast } from 'sonner'

type Customer = { id: string; full_name: string | null; email: string }
type Product = { id: string; name: string; price: number }

export function CreateScheduleDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [selectedProduct, setSelectedProduct] = useState('')

  useEffect(() => {
    if (open) {
      getCustomerList().then((result) => {
        if (result.data) setCustomers(result.data as Customer[])
      })
      getProductsList().then((result) => {
        if (result.data) setProducts(result.data as Product[])
      })
    }
  }, [open])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.set('customer_id', selectedCustomer)
    formData.set('product_id', selectedProduct)
    
    const result = await createSchedule(formData)

    setLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Schedule created successfully.')
      setOpen(false)
      setSelectedCustomer('')
      setSelectedProduct('')
      router.refresh()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2" />}>
        <Plus className="size-4" />
        New Schedule
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Recurring Schedule</DialogTitle>
          <DialogDescription>
            Set up an automatic recurring delivery for a customer.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Customer</Label>
            {customers.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">
                No customers found. Add a customer first.
              </p>
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
            <Label>Product</Label>
            {products.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">
                No products found. Add items to inventory first.
              </p>
            ) : (
              <Select value={selectedProduct} onValueChange={(v) => setSelectedProduct(v ?? '')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" name="quantity" type="number" min={1} defaultValue={1} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select name="frequency" defaultValue="weekly">
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="next_delivery_date">Starting Delivery Date</Label>
            <Input id="next_delivery_date" name="next_delivery_date" type="date" required />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !selectedCustomer || !selectedProduct}
          >
            {loading ? 'Creating...' : 'Create Schedule'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
