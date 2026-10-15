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
import { addCustomer } from '@/lib/actions/customers'
import { toast } from 'sonner'

export function AddCustomerDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await addCustomer(formData)

    setLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Customer added successfully.')
      setOpen(false)
      router.refresh()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2" />}>
        <Plus className="size-4" />
        Add Customer
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
          <DialogDescription>
            Enter the details for the new customer profile.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input id="full_name" name="full_name" placeholder="John Doe" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="john@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" name="phone" placeholder="+63 900 000 0000" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Delivery Address</Label>
            <Input id="address" name="address" placeholder="123 Main St..." />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Saving...' : 'Save Customer'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
