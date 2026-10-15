'use client'

import { MoreHorizontal, Trash, XCircle } from "lucide-react"
import { updateOrderStatus, deleteOrder } from "@/lib/actions/orders"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function OrderActions({ orderId, status }: { orderId: string, status: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleCancel = async () => {
    setLoading(true)
    const res = await updateOrderStatus(orderId, 'cancelled')
    if (res.error) toast.error(res.error)
    else {
      toast.success("Order cancelled")
      router.refresh()
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this order?')) return
    setLoading(true)
    const res = await deleteOrder(orderId)
    if (res.error) toast.error(res.error)
    else {
      toast.success("Order deleted")
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted disabled:opacity-50" disabled={loading}>
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {status !== 'cancelled' && (
          <DropdownMenuItem onClick={handleCancel} className="text-amber-600 focus:text-amber-600 cursor-pointer">
            <XCircle className="mr-2 h-4 w-4" />
            Cancel Order
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600 cursor-pointer">
          <Trash className="mr-2 h-4 w-4" />
          Delete Order
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
