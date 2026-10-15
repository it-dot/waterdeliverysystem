"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export function RealtimeProvider() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // We create a single channel for all our database changes
    const channel = supabase
      .channel('system-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            toast.success('A new order has been placed!')
          } else if (payload.eventType === 'UPDATE') {
            toast.info(`Order #${payload.new.id.slice(0, 8).toUpperCase()} was updated.`)
          }
          router.refresh()
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'deliveries' },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            toast.info(`Delivery status updated to: ${payload.new.status}`)
          }
          router.refresh()
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'inventory' },
        (payload) => {
          // We can refresh silently for inventory changes to keep stock up to date
          router.refresh()
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Realtime listener connected!')
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, router])

  return null
}
