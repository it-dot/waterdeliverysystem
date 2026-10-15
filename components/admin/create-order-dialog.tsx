'use client'

import { useState, useEffect, useCallback } from 'react'
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
import { createOrder } from '@/lib/actions/orders'
import { getCustomerList } from '@/lib/actions/customers'
import { getProductsList } from '@/lib/actions/inventory'
import { toast } from 'sonner'
import { LocationPickerMapWrapper } from '@/components/map/LocationPickerMapWrapper'
import { BUTUAN_BARANGAYS } from '@/lib/constants/barangays'

type Customer = { id: string; full_name: string | null; email: string }
type Product = { id: string; name: string; price: number }

export function CreateOrderDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [selectedProduct, setSelectedProduct] = useState('')
  const [mapLocation, setMapLocation] = useState<{lat: number, lng: number} | null>(null)
  const [streetAddress, setStreetAddress] = useState('')
  const [selectedBarangay, setSelectedBarangay] = useState('')

  useEffect(() => {
    if (open) {
      getCustomerList().then((result) => {
        if (result.data) {
          setCustomers(result.data as Customer[])
        }
      })
      getProductsList().then((result) => {
        if (result.data) {
          setProducts(result.data as Product[])
        }
      })
    }
  }, [open])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    
    // Combine street address and barangay
    let combinedAddress = `${streetAddress}, Brgy. ${selectedBarangay}, Butuan City`
    
    if (mapLocation) {
      combinedAddress = `${mapLocation.lat},${mapLocation.lng}|${combinedAddress}`
    }
    
    formData.set('delivery_address', combinedAddress)

    formData.set('customer_id', selectedCustomer)
    formData.set('product_id', selectedProduct)
    
    const result = await createOrder(formData)

    setLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Order created successfully.')
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
        Create Order
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
          <DialogDescription>
            Manually create a new water delivery order.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Customer</Label>
            {customers.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">
                No customers yet. Add a customer first from the Customers page.
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
                      {p.name} - ₱{p.price.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="street_address">House/Street Address</Label>
              <Input 
                id="street_address" 
                placeholder="123 Main St..." 
                required 
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="barangay">Barangay</Label>
              <Select value={selectedBarangay} onValueChange={(v) => setSelectedBarangay(v ?? '')} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select Barangay" />
                </SelectTrigger>
                <SelectContent>
                  {BUTUAN_BARANGAYS.map((brgy) => (
                    <SelectItem key={brgy} value={brgy}>{brgy}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Pin Delivery Location</Label>
            <LocationPickerMapWrapper 
              onLocationSelect={useCallback((lat: number, lng: number) => {
                setMapLocation({ lat, lng })
              }, [])}
            />
            {!mapLocation && <p className="text-xs text-amber-600">Please click on the map to pin the exact location.</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Qty (Gallons)</Label>
              <Input id="quantity" name="quantity" type="number" min={1} defaultValue={1} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment_method">Payment Method</Label>
              <Select name="payment_method" defaultValue="cash">
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash on Delivery</SelectItem>
                  <SelectItem value="gcash">GCash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading || !selectedCustomer || !selectedProduct}
          >
            {loading ? 'Creating...' : 'Create Order'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
