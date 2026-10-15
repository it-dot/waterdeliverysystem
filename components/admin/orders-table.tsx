'use client'

import { useState } from "react"
import { Search, Trash, CheckCircle, XCircle } from "lucide-react"
import { OrderActions } from "@/components/admin/order-actions"
import { bulkDeleteOrders, bulkUpdateOrderStatus } from "@/lib/actions/orders"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

type Order = {
  id: string
  status: string
  total_amount: number
  created_at: string
  profiles?: {
    full_name: string | null
  } | null
  order_items?: {
    products?: {
      name: string | null
    } | null
  }[] | null
}

export function OrdersTable({ orders, error }: { orders: Order[], error?: any }) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (order.profiles?.full_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (order.order_items?.[0]?.products?.name?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  })

  const toggleAll = () => {
    if (selectedIds.size === filteredOrders.length && filteredOrders.length > 0) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredOrders.map(o => o.id)))
    }
  }

  const toggleOne = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  const handleBulkStatus = async (status: string) => {
    if (selectedIds.size === 0) return
    setLoading(true)
    const res = await bulkUpdateOrderStatus(Array.from(selectedIds), status)
    if (res.error) toast.error(res.error)
    else {
      toast.success(`Marked ${selectedIds.size} orders as ${status}`)
      setSelectedIds(new Set())
    }
    setLoading(false)
  }

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} orders?`)) return
    
    setLoading(true)
    const res = await bulkDeleteOrders(Array.from(selectedIds))
    if (res.error) toast.error(res.error)
    else {
      toast.success(`Deleted ${selectedIds.size} orders`)
      setSelectedIds(new Set())
    }
    setLoading(false)
  }

  if (error) {
    return (
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <h3 className="font-semibold text-lg text-red-600">Error loading orders</h3>
          <p className="text-muted-foreground text-sm mt-1 max-w-sm">
            Please check your database connection.
          </p>
        </div>
      </div>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl bg-card shadow-sm">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted/50 mb-4">
          <Search className="size-6 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg">No orders found</h3>
        <p className="text-muted-foreground text-sm mt-1 max-w-sm">
          Get started by creating a new order.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search order ref, customer, or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-lg border border-border/80 bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select 
            className="h-9 rounded-lg border border-border/80 bg-background px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="in-transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <span className="text-xs text-muted-foreground whitespace-nowrap hidden sm:inline">
            {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
        {selectedIds.size > 0 && (
          <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/60 border-b border-border/70 text-xs">
            <span className="font-semibold text-foreground px-2">{selectedIds.size} selected</span>
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => handleBulkStatus('processing')} disabled={loading}>Mark Processing</Button>
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => handleBulkStatus('in-transit')} disabled={loading}>Mark In Transit</Button>
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => handleBulkStatus('delivered')} disabled={loading}>Mark Delivered</Button>
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => handleBulkStatus('cancelled')} disabled={loading}>Mark Cancelled</Button>
            <Button variant="destructive" size="sm" className="h-8 text-xs ml-auto" onClick={handleBulkDelete} disabled={loading}>Delete Selected</Button>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4 w-[40px]">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.size === filteredOrders.length && filteredOrders.length > 0} 
                    onChange={toggleAll}
                    className="rounded border-border text-primary focus:ring-ring cursor-pointer"
                    suppressHydrationWarning
                  />
                </th>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 w-[50px]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="size-8 text-muted-foreground mb-3 opacity-40" />
                      <h3 className="font-semibold text-sm text-foreground">No orders found</h3>
                      <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                        Adjust your search query or status filter to find orders.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.map((order) => {
                const status = order.status.toLowerCase()
                const statusConfig = 
                  status === 'delivered' ? { dot: 'bg-emerald-500', pill: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' } :
                  status === 'in-transit' ? { dot: 'bg-blue-500', pill: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20' } :
                  status === 'pending' ? { dot: 'bg-amber-500', pill: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20' } :
                  status === 'processing' ? { dot: 'bg-purple-500', pill: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20' } :
                  { dot: 'bg-red-500', pill: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20' }

                const customerName = order.profiles?.full_name || 'Unknown'
                const initials = customerName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

                return (
                  <tr key={order.id} className={`transition-colors hover:bg-muted/40 ${selectedIds.has(order.id) ? 'bg-primary/5' : ''}`}>
                    <td className="py-3 px-4">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.has(order.id)} 
                        onChange={() => toggleOne(order.id)}
                        className="rounded border-border text-primary focus:ring-ring cursor-pointer"
                        suppressHydrationWarning
                      />
                    </td>
                    <td className="py-3 px-4 text-xs font-medium">
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-muted/60 border border-border/60 text-foreground font-semibold">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                          {initials || "CU"}
                        </div>
                        <span className="text-foreground">{customerName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{order.order_items?.[0]?.products?.name || 'Water Gallon'}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${statusConfig.pill}`}>
                        <span className={`size-1.5 rounded-full ${statusConfig.dot}`} />
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('-', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-mono font-medium tabular-nums text-foreground">
                      ₱{order.total_amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-right">
                      <OrderActions orderId={order.id} status={order.status} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
