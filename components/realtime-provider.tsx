"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

/**
 * Professional subtle web audio chime for real-time notifications
 */
function playNotificationChime() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return
    const ctx = new AudioContextClass()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = "sine"
    osc.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12) // A5

    gain.gain.setValueAtTime(0.06, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.3)
  } catch {
    // Autoplay policy or unavailable
  }
}

/**
 * Dispatches a client custom event to sync with the NotificationsMenu
 */
function broadcastNotification({
  title,
  desc,
  role,
}: {
  title: string
  desc: string
  role?: "admin" | "customer" | "rider" | "all"
}) {
  playNotificationChime()
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("clearwell:notification", {
        detail: {
          title,
          desc,
          time: "Just now",
          role: role || "all",
        },
      })
    )
  }
}

export function RealtimeProvider() {
  const router = useRouter()
  const supabase = createClient()
  const userInfoRef = useRef<{ id: string; role: string } | null>(null)

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return
    }

    // Fetch and track active user credentials for targeted event filtering
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single()
          userInfoRef.current = {
            id: user.id,
            role: profile?.role || "customer",
          }
        }
      } catch (err) {
        console.error("Realtime auth user check error:", err)
      }
    }

    fetchUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()
        userInfoRef.current = {
          id: session.user.id,
          role: profile?.role || "customer",
        }
      } else {
        userInfoRef.current = null
      }
    })

    // Subscribe to live PostgreSQL database changes across orders, deliveries, and inventory
    const channel = supabase
      .channel("clearwell-realtime-global")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          const current = userInfoRef.current
          const newRecord = payload.new as any
          const shortId = newRecord?.id ? newRecord.id.slice(0, 8).toUpperCase() : ""

          if (payload.eventType === "INSERT") {
            if (current?.role === "admin" || current?.role === "dispatcher") {
              toast.info("💧 New Water Order Placed!", {
                description: `Order #${shortId} was placed and queued for dispatch.`,
                duration: 6000,
              })
              broadcastNotification({
                title: `New Order #${shortId}`,
                desc: "A customer placed a new water refill order.",
                role: "admin",
              })
            } else if (current?.id && newRecord?.customer_id === current.id) {
              toast.success("Order Placed Successfully", {
                description: `Your order #${shortId} was received and is awaiting fulfillment.`,
                duration: 6000,
              })
              broadcastNotification({
                title: "Order Placed",
                desc: `Your water order #${shortId} was received by station dispatch.`,
                role: "customer",
              })
            }
          } else if (payload.eventType === "UPDATE") {
            const isMyOrder = current?.id && newRecord?.customer_id === current.id

            if (isMyOrder) {
              if (newRecord?.status === "in-transit") {
                toast.info("🚚 Delivery On The Way!", {
                  description: `Order #${shortId} is in transit! The courier is en route to your doorstep.`,
                  duration: 8000,
                })
                broadcastNotification({
                  title: "Delivery On The Way",
                  desc: `Your water delivery #${shortId} is in transit and will arrive shortly.`,
                  role: "customer",
                })
              } else if (newRecord?.status === "delivered") {
                toast.success("💧 Water Bottles Delivered!", {
                  description: `Order #${shortId} has arrived! Thank you for choosing Clearwell.`,
                  duration: 8000,
                })
                broadcastNotification({
                  title: "Product Delivered",
                  desc: `Your water order #${shortId} has been fulfilled and delivered.`,
                  role: "customer",
                })
              } else if (newRecord?.status === "processing") {
                toast.info("Order Confirmed", {
                  description: `Order #${shortId} is being bottled and prepped for courier pickup.`,
                })
                broadcastNotification({
                  title: "Order Prepped",
                  desc: `Order #${shortId} is being prepared at the station.`,
                  role: "customer",
                })
              } else if (newRecord?.status === "cancelled") {
                toast.error("Order Cancelled", {
                  description: `Order #${shortId} has been cancelled.`,
                })
                broadcastNotification({
                  title: "Order Cancelled",
                  desc: `Your order #${shortId} was cancelled.`,
                  role: "customer",
                })
              }
            } else if (current?.role === "admin" || current?.role === "dispatcher") {
              if (newRecord?.status === "delivered") {
                toast.success(`Order #${shortId} Delivered`, {
                  description: "Order marked fulfilled by courier.",
                })
                broadcastNotification({
                  title: `Order #${shortId} Delivered`,
                  desc: "Delivery successfully fulfilled and closed.",
                  role: "admin",
                })
              } else if (newRecord?.status === "in-transit") {
                broadcastNotification({
                  title: `Order #${shortId} In-Transit`,
                  desc: "Courier is now en route with customer containers.",
                  role: "admin",
                })
              } else if (newRecord?.status === "cancelled") {
                broadcastNotification({
                  title: `Order #${shortId} Cancelled`,
                  desc: "Order was marked as cancelled in the queue.",
                  role: "admin",
                })
              }
            }
          }
          router.refresh()
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "deliveries" },
        (payload) => {
          const current = userInfoRef.current
          const newDelivery = payload.new as any

          if (current?.role === "rider" && newDelivery?.rider_id === current.id) {
            if (payload.eventType === "INSERT") {
              toast.info("🛵 New Delivery Assigned!", {
                description: "A new delivery stop has been added to your route queue.",
                duration: 7000,
              })
              broadcastNotification({
                title: "New Delivery Assigned",
                desc: "A new stop has been added to your active route queue.",
                role: "rider",
              })
            } else if (payload.eventType === "UPDATE") {
              if (newDelivery.status === "delivered") {
                toast.success("Drop Completed! 🎉", {
                  description: "Delivery recorded as fulfilled.",
                })
                broadcastNotification({
                  title: "Delivery Completed",
                  desc: "Drop was successfully fulfilled and recorded.",
                  role: "rider",
                })
              }
            }
          } else if (current?.role === "admin" || current?.role === "dispatcher") {
            if (payload.eventType === "INSERT") {
              broadcastNotification({
                title: "Delivery Dispatched",
                desc: "A route stop was assigned to an active courier.",
                role: "admin",
              })
            }
          }
          router.refresh()
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "inventory" },
        () => {
          router.refresh()
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Realtime notification channel connected")
        }
      })

    return () => {
      authListener?.subscription.unsubscribe()
      supabase.removeChannel(channel)
    }
  }, [supabase, router])

  return null
}
