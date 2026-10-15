'use client'

import { MoreHorizontal, Trash, Send, CheckCircle, Clock } from "lucide-react"
import { updateInvoiceStatus, deleteInvoice } from "@/lib/actions/invoices"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function InvoiceActions({ invoiceId, status }: { invoiceId: string, status: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true)
    const res = await updateInvoiceStatus(invoiceId, newStatus)
    if (res.error) toast.error(res.error)
    else {
      toast.success(`Invoice marked as ${newStatus}`)
      router.refresh()
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this invoice?')) return
    setLoading(true)
    const res = await deleteInvoice(invoiceId)
    if (res.error) toast.error(res.error)
    else {
      toast.success("Invoice deleted")
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
        {status !== 'paid' && (
          <DropdownMenuItem onClick={() => handleStatusChange('paid')} className="cursor-pointer text-emerald-600 focus:text-emerald-600">
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark as Paid
          </DropdownMenuItem>
        )}
        {status === 'draft' && (
          <DropdownMenuItem onClick={() => handleStatusChange('sent')} className="cursor-pointer text-blue-600 focus:text-blue-600">
            <Send className="mr-2 h-4 w-4" />
            Mark as Sent
          </DropdownMenuItem>
        )}
        {status !== 'overdue' && status !== 'paid' && status !== 'cancelled' && (
          <DropdownMenuItem onClick={() => handleStatusChange('overdue')} className="cursor-pointer text-amber-600 focus:text-amber-600">
            <Clock className="mr-2 h-4 w-4" />
            Mark as Overdue
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600 cursor-pointer">
          <Trash className="mr-2 h-4 w-4" />
          Delete Invoice
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
