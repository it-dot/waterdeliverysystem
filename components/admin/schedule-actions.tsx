'use client'

import { MoreHorizontal, Trash, XCircle } from "lucide-react"
import { updateScheduleStatus, deleteSchedule } from "@/lib/actions/schedules"
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

export function ScheduleActions({ scheduleId, status }: { scheduleId: string, status: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleCancel = async () => {
    setLoading(true)
    const res = await updateScheduleStatus(scheduleId, 'cancelled')
    if (res.error) toast.error(res.error)
    else {
      toast.success("Schedule cancelled")
      router.refresh()
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this schedule?')) return
    setLoading(true)
    const res = await deleteSchedule(scheduleId)
    if (res.error) toast.error(res.error)
    else {
      toast.success("Schedule deleted")
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
            Cancel Schedule
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600 cursor-pointer">
          <Trash className="mr-2 h-4 w-4" />
          Delete Schedule
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
