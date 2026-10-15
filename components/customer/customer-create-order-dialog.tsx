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
import { getProductsList } from '@/lib/actions/inventory'
import { toast } from 'sonner'
import { customerPlaceOrder } from '@/lib/actions/customer-mutations'
import { getCustomerProfile } from '@/lib/actions/customer'
import { LocationPickerMapWrapper } from '@/components/map/LocationPickerMapWrapper'
import { BUTUAN_BARANGAYS } from '@/lib/constants/barangays'

type Product = { id: string; name: string; price: number }

export function CustomerCreateOrderDialog({ trigger }: { trigger?: React.ReactElement }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState('')
  const [mapLocation, setMapLocation] = useState<{lat: number, lng: number} | null>(null)
  const [streetAddress, setStreetAddress] = useState('')
  const [selectedBarangay, setSelectedBarangay] = useState('')

  useEffect(() => {
    if (open) {
      getProductsList().then((result) => {
        if (result.data) {
          setProducts(result.data as Product[])
        }
      })
      getCustomerProfile().then((result) => {
        if (result.data && result.data.address) {
          const savedAddress = result.data.address
          
          let addressPart = savedAddress
          if (savedAddress.includes('|')) {
            const [coords, rest] = savedAddress.split('|')
            const [lat, lng] = coords.split(',').map(Number)
            if (!isNaN(lat) && !isNaN(lng)) {
              setMapLocation({ lat, lng })
            }
            addressPart = rest
          }
          
          // Try to parse "Street, Brgy. Barangay, Butuan City"
          const brgyMatch = addressPart.match(/Brgy\.\s(.*?),\sButuan City/i)
          if (brgyMatch && brgyMatch[1]) {
            setSelectedBarangay(brgyMatch[1])
            const street = addressPart.split(', Brgy.')[0]
            if (street) setStreetAddress(street.trim())
          } else {
            setStreetAddress(addressPart)
          }
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
    
    // Append map location if available
    if (mapLocation) {
      combinedAddress = `${mapLocation.lat},${mapLocation.lng}|${combinedAddress}`
    }
    
    formData.set('delivery_address', combinedAddress)

    formData.set('product_id', selectedProduct)

    const result = await customerPlaceOrder(formData)

    setLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Order placed successfully! We will assign a rider shortly.')
      setOpen(false)
      setSelectedProduct('')
      router.refresh()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger || <Button className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-sm transition-all hover:-translate-y-0.5" />}>
        {!trigger && (
          <>
            <Plus className="size-4" />
            Place New Order
          </>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Order Water Delivery</DialogTitle>
          <DialogDescription>
            Fill out your delivery details to place an order.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Select Product</Label>
            {products.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">
                Loading products...
              </p>
            ) : (
              <Select value={selectedProduct} onValueChange={(v) => setSelectedProduct(v ?? '')} required>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a product" />
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
              initialPinnedLocation={mapLocation || undefined}
              defaultLocation={mapLocation ? [mapLocation.lat, mapLocation.lng] : undefined}
              onLocationSelect={useCallback((lat: number, lng: number) => {
                setMapLocation({ lat, lng })
              }, [])}
            />
            {!mapLocation && <p className="text-xs text-amber-600">Please click on the map to pin your exact location.</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity (Gallons)</Label>
              <Input id="quantity" name="quantity" type="number" min={1} defaultValue={1} required />
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
            className="w-full bg-primary hover:bg-primary/90 font-semibold"
            disabled={loading || !selectedProduct}
          >
            {loading ? 'Placing Order...' : 'Confirm Order'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
