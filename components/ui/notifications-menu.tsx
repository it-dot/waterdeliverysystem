"use client"

import { Bell } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"

const mockNotifications = {
  admin: [
    { id: 1, title: "New Order #A1B2", desc: "Customer placed a new order for 5 gallons.", time: "10 min ago", read: false },
    { id: 2, title: "Payment Received", desc: "Payment of ₱250 confirmed.", time: "1 hour ago", read: false },
    { id: 3, title: "Low Stock Alert", desc: "Purified water is running low.", time: "2 hours ago", read: true },
  ],
  customer: [
    { id: 1, title: "Delivery Arriving Soon", desc: "Your order is in-transit and will arrive shortly.", time: "5 min ago", read: false },
    { id: 2, title: "Order Confirmed", desc: "Your order for 3 gallons has been confirmed.", time: "2 hours ago", read: true },
    { id: 3, title: "Invoice Generated", desc: "A new invoice for your recent deliveries is ready.", time: "1 day ago", read: true },
  ],
  rider: [
    { id: 1, title: "New Delivery Assigned", desc: "You have been assigned a new delivery route.", time: "Just now", read: false },
    { id: 2, title: "Route Updated", desc: "Your current route has been optimized.", time: "30 min ago", read: false },
  ]
}

export function NotificationsMenu({ role = "admin" }: { role?: "admin" | "customer" | "rider" }) {
  const [notifications, setNotifications] = useState(mockNotifications[role])
  const unreadCount = notifications.filter(n => !n.read).length

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground">
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-600 border-2 border-background" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-[380px] p-0 rounded-xl overflow-hidden shadow-2xl border-border/50" 
        align="end" 
        sideOffset={12}
      >
        <div className="flex items-center justify-between px-5 py-4 bg-muted/30">
          <h3 className="font-semibold text-base tracking-tight">Notifications</h3>
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Mark all as read
            </button>
          )}
        </div>
        <Separator />
        <div className="max-h-[420px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-10 text-center flex flex-col items-center justify-center">
              <Bell className="size-8 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-foreground">You're all caught up!</p>
              <p className="text-xs text-muted-foreground mt-1">No new notifications.</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-border/50">
              {notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={`flex flex-col gap-1.5 p-5 transition-colors hover:bg-muted/50 ${!n.read ? 'bg-primary/[0.03]' : ''}`}
                >
                  <div className="flex w-full items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      {!n.read && <span className="size-2 rounded-full bg-primary shrink-0 mt-1" />}
                      <span className={`text-sm font-semibold leading-none tracking-tight ${!n.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {n.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap font-medium mt-0.5">{n.time}</span>
                  </div>
                  <p className={`text-sm leading-snug pl-${!n.read ? '4' : '0'} ${!n.read ? 'text-muted-foreground' : 'text-muted-foreground/70'}`}>
                    {n.desc}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
