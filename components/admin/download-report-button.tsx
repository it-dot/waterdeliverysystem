'use client'

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

type ReportType = 'sales' | 'delivery' | 'inventory'

export function DownloadReportButton({ reportType, data }: { reportType: ReportType, data: any }) {
  const handleDownload = () => {
    let csvContent = ''
    const timestamp = new Date().toISOString().split('T')[0]

    if (reportType === 'sales') {
      const headers = ['Order ID', 'Status', 'Total Amount', 'Date']
      csvContent = [headers.join(',')]
        .concat(
          (data.orders || []).map((o: any) =>
            [o.id, o.status, o.total_amount, new Date(o.created_at).toISOString()].join(',')
          )
        )
        .join('\n')
    } else if (reportType === 'delivery') {
      const headers = ['Delivery ID', 'Status', 'Rider', 'Created', 'Completed']
      csvContent = [headers.join(',')]
        .concat(
          (data.deliveries || []).map((d: any) =>
            [
              d.id,
              d.status,
              `"${d.profiles?.full_name || 'Unassigned'}"`,
              new Date(d.created_at).toISOString(),
              d.completed_at ? new Date(d.completed_at).toISOString() : 'N/A'
            ].join(',')
          )
        )
        .join('\n')
    } else if (reportType === 'inventory') {
      const headers = ['Product', 'Stock Level', 'Threshold', 'Unit Price', 'Last Restocked']
      csvContent = [headers.join(',')]
        .concat(
          (data.inventory || []).map((i: any) =>
            [
              `"${i.products?.name || 'Unknown'}"`,
              i.stock_level,
              i.low_stock_threshold,
              i.products?.price || 0,
              i.last_restocked_at ? new Date(i.last_restocked_at).toISOString() : 'Never'
            ].join(',')
          )
        )
        .join('\n')
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `${reportType}_report_${timestamp}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button variant="outline" className="w-full gap-2 mt-auto" onClick={handleDownload}>
      <Download className="size-4" />
      Download CSV
    </Button>
  )
}
