'use client'

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

interface DownloadReceiptButtonProps {
  invoice: any
}

export function DownloadReceiptButton({ invoice }: DownloadReceiptButtonProps) {
  const handleDownload = () => {
    const doc = new jsPDF()
    
    // Header
    doc.setFontSize(20)
    doc.text("PURCHASE RECEIPT", 14, 22)
    
    doc.setFontSize(10)
    doc.text(`Invoice No: ${invoice.invoice_number}`, 14, 32)
    doc.text(`Date: ${new Date(invoice.created_at).toLocaleDateString()}`, 14, 38)
    doc.text(`Due Date: ${invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'N/A'}`, 14, 44)
    doc.text(`Status: ${invoice.status.toUpperCase()}`, 14, 50)
    
    // Order Breakdown
    const orderItems = invoice.orders?.order_items || []
    
    if (orderItems.length > 0) {
      doc.setFontSize(14)
      doc.text("Order Breakdown", 14, 65)
      
      const tableColumn = ["Product", "Quantity", "Unit Price", "Total"]
      const tableRows = orderItems.map((item: any) => [
        item.products?.name || "Unknown Product",
        item.quantity,
        `PHP ${item.price_at_time.toFixed(2)}`,
        `PHP ${(item.quantity * item.price_at_time).toFixed(2)}`
      ])
      
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 70,
      })
      
      const finalY = (doc as any).lastAutoTable.finalY || 70
      
      doc.setFontSize(12)
      doc.text(`Total Amount: PHP ${invoice.total_amount.toFixed(2)}`, 14, finalY + 10)
    } else {
      doc.setFontSize(12)
      doc.text(`Total Amount: PHP ${invoice.total_amount.toFixed(2)}`, 14, 70)
      doc.setFontSize(10)
      doc.text("(No detailed breakdown available for this invoice)", 14, 78)
    }
    
    // Save
    doc.save(`Receipt_${invoice.invoice_number}.pdf`)
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleDownload}
      className="flex items-center gap-2"
    >
      <Download className="size-4" />
      PDF Receipt
    </Button>
  )
}
