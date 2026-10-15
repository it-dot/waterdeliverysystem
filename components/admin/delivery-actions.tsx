'use client'

import { MoreHorizontal, Trash, XCircle } from "lucide-react"
import { updateDeliveryStatus, deleteDelivery } from "@/lib/actions/deliveries"
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

export function DeliveryActions({ deliveryId, status }: { deliveryId: string, status: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleCancel = async () => {
    setLoading(true)
    const res = await updateDeliveryStatus(deliveryId, 'failed')
    if (res.error) toast.error(res.error)
    else {
      toast.success("Delivery marked as failed (cancelled)")
      router.refresh()
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this delivery?')) return
    setLoading(true)
    const res = await deleteDelivery(deliveryId)
    if (res.error) toast.error(res.error)
    else {
      toast.success("Delivery deleted")
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
        {status !== 'failed' && status !== 'delivered' && (
          <DropdownMenuItem onClick={handleCancel} className="text-amber-600 focus:text-amber-600 cursor-pointer">
            <XCircle className="mr-2 h-4 w-4" />
            Cancel Delivery
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600 cursor-pointer">
          <Trash className="mr-2 h-4 w-4" />
          Delete Delivery
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
