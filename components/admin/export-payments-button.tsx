"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ExportPaymentsButton({ payments }: { payments: any[] }) {
  const handleExport = () => {
    if (!payments || payments.length === 0) return

    // Create CSV content
    const headers = ["Payment ID", "Customer Name", "Provider", "Status", "Amount", "Date"]
    const csvRows = [headers.join(",")]

    for (const p of payments) {
      const row = [
        p.id,
        `"${p.orders?.profiles?.full_name || 'Unknown'}"`,
        p.provider,
        p.status,
        p.amount,
        new Date(p.created_at).toISOString()
      ]
      csvRows.push(row.join(","))
    }

    const csvContent = csvRows.join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    
    // Trigger download
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `payments_export_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleExport}
      disabled={!payments || payments.length === 0}
      className="gap-2"
    >
      <Download className="size-4" />
      Export CSV
    </Button>
  )
}
