'use client'

import { useState } from 'react'
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
import { addInventoryItem } from '@/lib/actions/inventory'
import { toast } from 'sonner'

export function AddInventoryDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await addInventoryItem(formData)

    setLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Product & Inventory added successfully.')
      setOpen(false)
      router.refresh()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2" />}>
        <Plus className="size-4" />
        Add Item
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Inventory Item</DialogTitle>
          <DialogDescription>
            Creates a new product and adds it to the inventory tracking system.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" name="name" placeholder="E.g., 19L Round Gallon" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price (₱)</Label>
            <Input id="price" name="price" type="number" step="0.01" placeholder="35.00" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock_level">Initial Stock</Label>
              <Input id="stock_level" name="stock_level" type="number" defaultValue={0} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="low_stock_threshold">Low Stock Threshold</Label>
              <Input id="low_stock_threshold" name="low_stock_threshold" type="number" defaultValue={10} />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Saving...' : 'Save Item'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
