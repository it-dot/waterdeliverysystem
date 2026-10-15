'use client'

import { useState } from 'react'
import { DeliveryActions } from './delivery-actions'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { bulkMarkDeliveryStatus } from '@/lib/actions/rider'

export function RiderDeliveriesTable({ deliveries }: { deliveries: any[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const toggleSelectAll = () => {
    if (selectedIds.length === deliveries.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(deliveries.map(d => d.id))
    }
  }

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handleBulkAction = async (action: 'in-transit' | 'delivered' | 'failed') => {
    if (selectedIds.length === 0) return
    setLoading(true)

    try {
      const res = await bulkMarkDeliveryStatus(selectedIds, action) as any
      if (res?.error) throw new Error(res.error)
      toast.success(`Updated ${selectedIds.length} deliveries to ${action}`)
      setSelectedIds([])
    } catch (err: any) {
      toast.error(err.message || 'Failed to perform bulk action')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg border">
          <span className="text-sm font-medium px-2">{selectedIds.length} selected</span>
          <Button variant="outline" size="sm" onClick={() => handleBulkAction('in-transit')} disabled={loading}>Mark In Transit</Button>
          <Button variant="outline" size="sm" onClick={() => handleBulkAction('delivered')} disabled={loading}>Mark Delivered</Button>
          <Button variant="outline" size="sm" onClick={() => handleBulkAction('failed')} disabled={loading}>Mark Failed</Button>
        </div>
      )}

      <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4 w-12">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === deliveries.length && deliveries.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-border text-primary focus:ring-ring cursor-pointer"
                    suppressHydrationWarning
                  />
                </th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-sm">
              {deliveries.map((delivery) => {
                const status = delivery.status.toLowerCase()
                const statusConfig = 
                  status === 'delivered' ? { dot: 'bg-emerald-500', pill: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' } :
                  status === 'in-transit' ? { dot: 'bg-blue-500', pill: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20' } :
                  status === 'assigned' ? { dot: 'bg-amber-500', pill: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20' } :
                  { dot: 'bg-red-500', pill: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20' }

                return (
                  <tr key={delivery.id} className="transition-colors hover:bg-muted/40">
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(delivery.id)}
                        onChange={() => toggleSelect(delivery.id)}
                        className="rounded border-border text-primary focus:ring-ring cursor-pointer"
                        suppressHydrationWarning
                      />
                    </td>
                    <td className="py-3.5 px-4 font-medium text-foreground">
                      {delivery.orders?.profiles?.full_name || 'Customer'}
                      {delivery.orders?.profiles?.phone && (
                        <span className="block text-xs text-muted-foreground font-normal mt-0.5">
                          {delivery.orders.profiles.phone}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-muted-foreground max-w-[220px] truncate">
                      {delivery.orders?.delivery_address?.includes('|') ? delivery.orders.delivery_address.split('|')[1] : delivery.orders?.delivery_address}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-medium tabular-nums text-foreground">
                        ₱{delivery.orders?.total_amount?.toFixed(2) || '0.00'}
                      </div>
                      <span className="block text-[11px] text-muted-foreground capitalize">
                        {delivery.orders?.payment_method || 'COD'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${statusConfig.pill}`}>
                        <span className={`size-1.5 rounded-full ${statusConfig.dot}`} />
                        {delivery.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right pr-4">
                      <DeliveryActions deliveryId={delivery.id} status={delivery.status} address={delivery.orders?.delivery_address} />
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
