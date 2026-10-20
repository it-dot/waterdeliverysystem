"use client"

import { Bell } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"

function formatRelativeTime(dateStr?: string) {
  if (!dateStr) return "Just now"
  try {
    const diffSec = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
    if (diffSec < 60) return "Just now"
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`
    return `${Math.floor(diffSec / 86400)}d ago`
  } catch {
    return "Recently"
  }
}

interface NotificationItem {
  id: string
  title: string
  desc: string
  time: string
  read: boolean
}

export function NotificationsMenu({ role = "admin" }: { role?: "admin" | "customer" | "rider" }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [hasNewRealtime, setHasNewRealtime] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const storageKey = `clearwell_read_notifications_${role}`

  const getStoredReadIds = useCallback((): Set<string> => {
    if (typeof window === "undefined") return new Set()
    try {
      const stored = localStorage.getItem(storageKey)
      return stored ? new Set(JSON.parse(stored)) : new Set()
    } catch {
      return new Set()
    }
  }, [storageKey])

  const saveStoredReadIds = useCallback((ids: Set<string>) => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(storageKey, JSON.stringify(Array.from(ids)))
    } catch {
      // Ignore localStorage errors
    }
  }, [storageKey])

  // Initial load of real database-backed notifications for the specific role
  useEffect(() => {
    const supabase = createClient()
    const readIds = getStoredReadIds()

    const loadInitialNotifications = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (role === "admin") {
          const { data: orders } = await supabase
            .from("orders")
            .select("id, total_amount, status, created_at, updated_at, profiles(full_name)")
            .order("updated_at", { ascending: false })
            .limit(10)

          if (orders && orders.length > 0) {
            const items: NotificationItem[] = orders.map((o) => {
              const id = `ord-${o.id}`
              const shortId = o.id.slice(0, 8).toUpperCase()
              const customerName = (o.profiles as any)?.full_name || "Customer"

              if (o.status === "delivered") {
                return {
                  id,
                  title: `Order #${shortId} Delivered`,
                  desc: `Fulfillment completed for ${customerName} (₱${o.total_amount?.toFixed(2) || "0.00"}).`,
                  time: formatRelativeTime(o.updated_at),
                  read: readIds.has(id),
                }
              } else if (o.status === "in-transit") {
                return {
                  id,
                  title: `Order #${shortId} En Route`,
                  desc: `Courier is in transit to ${customerName}.`,
                  time: formatRelativeTime(o.updated_at),
                  read: readIds.has(id),
                }
              } else {
                return {
                  id,
                  title: `Order #${shortId} Received`,
                  desc: `${customerName} ordered ₱${o.total_amount?.toFixed(2) || "0.00"}.`,
                  time: formatRelativeTime(o.created_at || o.updated_at),
                  read: readIds.has(id) || o.status === "cancelled",
                }
              }
            })
            setNotifications(items)
          }
        } else if (role === "rider") {
          if (!user) return
          const { data: deliveries } = await supabase
            .from("deliveries")
            .select("id, status, updated_at, scheduled_date, orders(id, delivery_address, total_amount, profiles(full_name))")
            .eq("rider_id", user.id)
            .order("updated_at", { ascending: false })
            .limit(10)

          if (deliveries && deliveries.length > 0) {
            const items: NotificationItem[] = deliveries.map((d: any) => {
              const id = `del-${d.id}`
              const customerName = d.orders?.profiles?.full_name || "Customer"
              const shortId = d.orders?.id ? d.orders.id.slice(0, 8).toUpperCase() : "STOP"

              if (d.status === "delivered") {
                return {
                  id,
                  title: "Delivery Completed",
                  desc: `Delivered order #${shortId} to ${customerName}.`,
                  time: formatRelativeTime(d.updated_at),
                  read: readIds.has(id),
                }
              } else if (d.status === "in-transit") {
                return {
                  id,
                  title: "Active En Route Mission",
                  desc: `Heading to ${customerName} for drop #${shortId}.`,
                  time: formatRelativeTime(d.updated_at),
                  read: readIds.has(id),
                }
              } else {
                return {
                  id,
                  title: "Delivery Assigned",
                  desc: `Assigned delivery for ${customerName} (₱${d.orders?.total_amount?.toFixed(2) || "0.00"}).`,
                  time: formatRelativeTime(d.updated_at),
                  read: readIds.has(id),
                }
              }
            })
            setNotifications(items)
          }
        } else if (role === "customer") {
          if (!user) return
          const { data: orders } = await supabase
            .from("orders")
            .select("id, status, updated_at, created_at")
            .eq("customer_id", user.id)
            .order("updated_at", { ascending: false })
            .limit(10)

          if (orders && orders.length > 0) {
            const items: NotificationItem[] = orders.map((o) => {
              const id = `ord-${o.id}`
              const shortId = o.id.slice(0, 8).toUpperCase()

              if (o.status === "delivered") {
                return {
                  id,
                  title: "Product Delivered",
                  desc: `Your water order #${shortId} has been successfully delivered.`,
                  time: formatRelativeTime(o.updated_at),
                  read: readIds.has(id),
                }
              } else if (o.status === "in-transit") {
                return {
                  id,
                  title: "Delivery In-Transit",
                  desc: `Rider is on the way with your water delivery #${shortId}.`,
                  time: formatRelativeTime(o.updated_at),
                  read: readIds.has(id),
                }
              } else {
                return {
                  id,
                  title: `Order ${o.status.charAt(0).toUpperCase() + o.status.slice(1)}`,
                  desc: `Order #${shortId} status is currently ${o.status}.`,
                  time: formatRelativeTime(o.updated_at),
                  read: readIds.has(id) || o.status === "cancelled",
                }
              }
            })
            setNotifications(items)
          }
        }
      } catch (err) {
        console.error("Error loading notifications:", err)
      }
    }

    loadInitialNotifications()
  }, [role, getStoredReadIds])

  // Real-time listener for incoming events
  useEffect(() => {
    const handleNotification = (e: Event) => {
      const customEvent = e as CustomEvent<{
        title: string
        desc: string
        time?: string
        role?: "admin" | "customer" | "rider" | "all"
      }>

      if (customEvent.detail) {
        if (customEvent.detail.role && customEvent.detail.role !== "all" && customEvent.detail.role !== role) {
          return
        }

        const newId = `rt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
        setNotifications((prev) => [
          {
            id: newId,
            title: customEvent.detail.title,
            desc: customEvent.detail.desc,
            time: customEvent.detail.time || "Just now",
            read: false,
          },
          ...prev,
        ])

        setHasNewRealtime(true)
      }
    }

    window.addEventListener("clearwell:notification", handleNotification)
    return () => {
      window.removeEventListener("clearwell:notification", handleNotification)
    }
  }, [role])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }))
    setNotifications(updated)
    setHasNewRealtime(false)

    const readIds = getStoredReadIds()
    updated.forEach((n) => readIds.add(n.id))
    saveStoredReadIds(readIds)
  }

  const markSingleAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
    const readIds = getStoredReadIds()
    readIds.add(id)
    saveStoredReadIds(readIds)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={(open) => {
      setIsOpen(open)
      if (open) setHasNewRealtime(false)
    }}>
      <DropdownMenuTrigger
        className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-xs transition-colors hover:bg-muted hover:text-foreground cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="View notifications"
      >
        <Bell className={`size-4 transition-transform ${hasNewRealtime ? "animate-bounce text-primary" : ""}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-red-600 border-2 border-background" />
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[calc(100vw-2rem)] sm:w-[380px] p-0 rounded-xl overflow-hidden shadow-2xl border-border/80"
        align="end"
        sideOffset={8}
      >
        <div className="flex items-center justify-between px-4 py-3 bg-muted/40 border-b border-border/60">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm tracking-tight text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-primary/15 text-primary">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="text-xs text-primary hover:underline cursor-pointer font-medium"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="max-h-[380px] overflow-y-auto divide-y divide-border/50">
          {notifications.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center justify-center">
              <div className="flex size-10 items-center justify-center rounded-full bg-muted/50 mb-2">
                <Bell className="size-5 text-muted-foreground/40" />
              </div>
              <p className="text-xs font-semibold text-foreground">You&apos;re all caught up!</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">No recent notifications.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markSingleAsRead(n.id)}
                className={`flex flex-col gap-1 p-3.5 transition-colors cursor-pointer hover:bg-muted/50 ${
                  !n.read ? "bg-primary/[0.04]" : ""
                }`}
              >
                <div className="flex w-full items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {!n.read && (
                      <span className="size-1.5 rounded-full bg-primary shrink-0 animate-pulse" />
                    )}
                    <span
                      className={`text-xs font-semibold tracking-tight truncate ${
                        !n.read ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {n.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap shrink-0">
                    {n.time}
                  </span>
                </div>
                <p
                  className={`text-xs leading-relaxed line-clamp-2 ${
                    !n.read ? "text-muted-foreground" : "text-muted-foreground/70"
                  }`}
                >
                  {n.desc}
                </p>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
