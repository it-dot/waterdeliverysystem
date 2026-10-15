"use client"

import { useState } from "react"
import { MoreHorizontal, Ban, Trash2, CheckCircle2 } from "lucide-react"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toggleCustomerStatus, deleteCustomer } from "@/lib/actions/customers"
import { toast } from "sonner"
import type { Customer } from "@/lib/services/customers/customers.service"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function CustomerActions({ customer }: { customer: Customer }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const isActive = customer.status !== 'Deactivated'

  const handleToggleStatus = async () => {
    setIsLoading(true)
    const result = await toggleCustomerStatus(customer.id, isActive) // If active, we deactivate
    if (result?.error) {
      toast.error(`Failed to ${isActive ? 'deactivate' : 'reactivate'} account: ${result.error}`)
    } else {
      toast.success(`Account ${isActive ? 'deactivated' : 'reactivated'} successfully.`)
    }
    setIsLoading(false)
  }

  const handleDelete = async () => {
    setIsLoading(true)
    const result = await deleteCustomer(customer.id)
    if (result?.error) {
      toast.error(`Failed to delete account: ${result.error}`)
      setIsLoading(false)
      setIsDeleting(false)
    } else {
      toast.success("Account deleted successfully.")
      setIsDeleting(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-md p-1.5 hover:bg-muted transition-colors disabled:opacity-50" disabled={isLoading}>
          <MoreHorizontal className="size-4 text-muted-foreground" />
          <span className="sr-only">Open menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleToggleStatus} className={isActive ? 'text-amber-600 focus:text-amber-600' : 'text-emerald-600 focus:text-emerald-600'}>
            {isActive ? (
              <>
                <Ban className="size-4 mr-2" />
                Deactivate Account
              </>
            ) : (
              <>
                <CheckCircle2 className="size-4 mr-2" />
                Reactivate Account
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsDeleting(true)} className="text-red-600 focus:text-red-600 focus:bg-red-100 dark:focus:bg-red-900/30">
            <Trash2 className="size-4 mr-2" />
            Delete Account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete the customer account for <strong>{customer.full_name}</strong> and remove all of their associated data. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleting(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button 
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
