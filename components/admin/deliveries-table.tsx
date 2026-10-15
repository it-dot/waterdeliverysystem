'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { DeliveryActions } from './delivery-actions'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { bulkUpdateDeliveryStatus, bulkDeleteDeliveries } from '@/lib/actions/deliveries'

export function DeliveriesTable({ deliveries }: { deliveries: any[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = 
      (delivery.orders?.profiles?.full_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (delivery.orders?.delivery_address?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (delivery.profiles?.full_name?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredDeliveries.length && filteredDeliveries.length > 0) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredDeliveries.map(d => d.id))
    }
  }

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedIds.length === 0) return
    setLoading(true)
    
    try {
      if (action === 'delete') {
        const res = await bulkDeleteDeliveries(selectedIds) as any
        if (res?.error) throw new Error(res.error)
        toast.success(`Deleted ${selectedIds.length} deliveries`)
      } else {
        const res = await bulkUpdateDeliveryStatus(selectedIds, action) as any
        if (res?.error) throw new Error(res.error)
        toast.success(`Updated ${selectedIds.length} deliveries to ${action}`)
      }
      setSelectedIds([])
    } catch (err: any) {
      toast.error(err.message || 'Failed to perform bulk action')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search deliveries by customer, address, or rider..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select 
          className="h-9 rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="assigned">Assigned</option>
          <option value="in-transit">In Transit</option>
          <option value="delivered">Delivered</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg border">
          <span className="text-sm font-medium px-2">{selectedIds.length} selected</span>
          <Button variant="outline" size="sm" onClick={() => handleBulkAction('assigned')} disabled={loading}>Mark Assigned</Button>
          <Button variant="outline" size="sm" onClick={() => handleBulkAction('in-transit')} disabled={loading}>Mark In Transit</Button>
          <Button variant="outline" size="sm" onClick={() => handleBulkAction('delivered')} disabled={loading}>Mark Delivered</Button>
          <Button variant="outline" size="sm" onClick={() => handleBulkAction('failed')} disabled={loading}>Mark Failed</Button>
          <Button variant="destructive" size="sm" onClick={() => handleBulkAction('delete')} disabled={loading}>Delete</Button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-sm font-medium text-muted-foreground">
              <th className="pb-3 px-4 w-12">
                <input 
                  type="checkbox" 
                  checked={selectedIds.length === filteredDeliveries.length && filteredDeliveries.length > 0} 
                  onChange={toggleSelectAll} 
                  className="rounded border-gray-300"
                  suppressHydrationWarning
                />
              </th>
              <th className="pb-3 font-medium">Customer</th>
              <th className="pb-3 font-medium">Address</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Rider</th>
              <th className="pb-3 font-medium text-right pr-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredDeliveries.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Search className="size-8 text-muted-foreground mb-4 opacity-50" />
                    <h3 className="font-semibold text-lg">No deliveries found</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Adjust your search or filters to find what you're looking for.
                    </p>
                  </div>
                </td>
              </tr>
            ) : filteredDeliveries.map((delivery) => (
              <tr key={delivery.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                <td className="py-4 px-4">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(delivery.id)} 
                    onChange={() => toggleSelect(delivery.id)} 
                    className="rounded border-gray-300"
                    suppressHydrationWarning
                  />
                </td>
                <td className="py-4 font-medium">
                  {delivery.orders?.profiles?.full_name || 'Unknown'}
                  {delivery.orders?.profiles?.phone && (
                    <span className="block text-xs text-muted-foreground font-normal">
                      {delivery.orders.profiles.phone}
                    </span>
                  )}
                  {delivery.orders?.order_items?.[0]?.products?.name && (
                    <span className="block text-xs text-primary font-medium mt-0.5 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
                      {delivery.orders.order_items[0].products.name}
                    </span>
                  )}
                </td>
                <td className="py-4 text-muted-foreground max-w-[200px] truncate">
                  {delivery.orders?.delivery_address?.includes('|') ? delivery.orders.delivery_address.split('|')[1] : delivery.orders?.delivery_address}
                </td>
                <td className="py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    delivery.status === 'delivered' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                    delivery.status === 'in-transit' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                    delivery.status === 'assigned' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {delivery.status.replace('-', ' ')}
                  </span>
                </td>
                <td className="py-4">
                  {delivery.profiles?.full_name ? (
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium text-xs">
                        {delivery.profiles.full_name.charAt(0)}
                      </div>
                      <span>{delivery.profiles.full_name}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground italic">Unassigned</span>
                  )}
                </td>
                <td className="py-4 text-right pr-4">
                  <DeliveryActions deliveryId={delivery.id} status={delivery.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
