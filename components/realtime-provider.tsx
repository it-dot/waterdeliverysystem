"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export function RealtimeProvider() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    let currentUserId: string | null = null
    let currentUserRole: string | null = null

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        currentUserId = user.id
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        if (profile?.role) {
          currentUserRole = profile.role
        }
      }
    })

    // We create a single channel for all our database changes
    const channel = supabase
      .channel('system-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            if (currentUserRole === 'admin' || currentUserRole === 'dispatcher') {
              toast.success('A new order has been placed!')
            }
          } else if (payload.eventType === 'UPDATE') {
            const newRecord = payload.new as any
            const isMyOrder = currentUserId && newRecord?.customer_id === currentUserId
            const shortId = newRecord?.id ? newRecord.id.slice(0, 8).toUpperCase() : ""

            if (isMyOrder) {
              if (newRecord?.status === 'in-transit') {
                toast.info("🚚 Delivery On The Way!", {
                  description: `Your water delivery for order #${shortId} is in transit. The rider is en route to your address!`,
                  duration: 8000,
                })
                window.dispatchEvent(new CustomEvent('clearwell:notification', {
                  detail: {
                    title: "Delivery On The Way",
                    desc: `Your order #${shortId} is in-transit and will arrive shortly.`,
                    time: "Just now"
                  }
                }))
              } else if (newRecord?.status === 'delivered') {
                toast.success("💧 Product Delivered!", {
                  description: `Your water products for order #${shortId} have arrived! Thank you for ordering with Clearwell.`,
                  duration: 9000,
                })
                window.dispatchEvent(new CustomEvent('clearwell:notification', {
                  detail: {
                    title: "Product Delivered",
                    desc: `Your water order #${shortId} has been successfully delivered.`,
                    time: "Just now"
                  }
                }))
              } else if (newRecord?.status === 'processing') {
                toast.info("Order Confirmed", {
                  description: `Order #${shortId} is being prepared for delivery.`,
                })
              } else if (newRecord?.status === 'cancelled') {
                toast.error("Order Cancelled", {
                  description: `Order #${shortId} has been cancelled.`,
                })
              }
            } else if (currentUserRole === 'admin' || currentUserRole === 'dispatcher') {
              if (newRecord?.status === 'delivered') {
                toast.success(`Order #${shortId} was delivered.`)
              } else {
                toast.info(`Order #${shortId} updated: ${newRecord?.status}`)
              }
            }
          }
          router.refresh()
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'deliveries' },
        (payload) => {
          const newDelivery = payload.new as any
          if (currentUserRole === 'rider' && newDelivery?.rider_id === currentUserId) {
            if (payload.eventType === 'INSERT') {
              toast.info("New delivery assigned to your route!")
            }
          }
          router.refresh()
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'inventory' },
        () => {
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
