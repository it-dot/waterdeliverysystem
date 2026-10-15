'use client'

import { MoreHorizontal, Trash, PackagePlus } from "lucide-react"
import { deleteInventoryItem, updateStock } from "@/lib/actions/inventory"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function InventoryActions({ 
  inventoryId, 
  productId, 
  currentStock,
  productName 
}: { 
  inventoryId: string, 
  productId: string,
  currentStock: number,
  productName: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [restockOpen, setRestockOpen] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this item?')) return
    setLoading(true)
    const res = await deleteInventoryItem(inventoryId, productId)
    if (res.error) toast.error(res.error)
    else {
      toast.success("Inventory item deleted")
      router.refresh()
    }
    setLoading(false)
  }

  const handleRestock = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const amount = Number(formData.get('amount'))
    
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount")
      return
    }
    
    setLoading(true)
    const newTotal = currentStock + amount
    const res = await updateStock(inventoryId, newTotal)
    if (res.error) toast.error(res.error)
    else {
      toast.success(`${productName} restocked by ${amount}`)
      setRestockOpen(false)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted disabled:opacity-50" disabled={loading}>
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setRestockOpen(true)} className="cursor-pointer">
            <PackagePlus className="mr-2 h-4 w-4" />
            Restock
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600 cursor-pointer">
            <Trash className="mr-2 h-4 w-4" />
            Delete Item
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={restockOpen} onOpenChange={setRestockOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restock {productName}</DialogTitle>
            <DialogDescription>
              Current stock: {currentStock} units. Enter the amount to add.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRestock} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Quantity to add</Label>
              <Input 
                id="amount" 
                name="amount" 
                type="number" 
                min="1" 
                placeholder="E.g. 50" 
                required 
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Restocking...' : 'Confirm Restock'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
