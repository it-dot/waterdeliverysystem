import { getCustomerInvoices } from "@/lib/actions/customer"
import { Receipt, FileText } from "lucide-react"
import { DownloadReceiptButton } from "@/components/customer/download-receipt-button"

export default async function CustomerInvoicesPage() {
  const { data: invoices, error } = await getCustomerInvoices()

  const formatStatus = (status: string) => {
    switch (status) {
      case 'paid': 
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Paid
          </span>
        )
      case 'sent': 
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400 border border-blue-500/20">
            <span className="size-1.5 rounded-full bg-blue-500" />
            Sent
          </span>
        )
      case 'overdue': 
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400 border border-amber-500/20">
            <span className="size-1.5 rounded-full bg-amber-500" />
            Overdue
          </span>
        )
      case 'cancelled': 
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:text-red-400 border border-red-500/20">
            <span className="size-1.5 rounded-full bg-red-500" />
            Cancelled
          </span>
        )
      default: 
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground border border-border/60">
            <span className="size-1.5 rounded-full bg-muted-foreground" />
            Draft
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Billing & Invoices</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View your delivery statements, payment records, and official tax receipts.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
        {error ? (
          <div className="p-12 text-center text-sm font-medium text-red-600">
             Error loading invoices. Please check your connection.
           </div>
        ) : !invoices || invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
             <div className="flex size-12 items-center justify-center rounded-full bg-muted/60 mb-3">
               <Receipt className="size-6 text-muted-foreground opacity-50" />
             </div>
             <h3 className="font-semibold text-sm text-foreground">No invoices yet</h3>
             <p className="text-muted-foreground text-xs mt-1 max-w-sm">
               You don't have any billing statements at the moment.
             </p>
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3 px-4">Invoice No.</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {invoices.map((invoice: any) => (
                  <tr key={invoice.id} className="transition-colors hover:bg-muted/40">
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-muted/60 border border-border/60 text-foreground font-semibold inline-flex items-center gap-1.5">
                        <FileText className="size-3 text-muted-foreground" />
                        {invoice.invoice_number}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {formatStatus(invoice.status)}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-muted-foreground">
                      {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'Upon Delivery'}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium tabular-nums text-right text-foreground">
                      ₱{invoice.total_amount.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex justify-end items-center gap-3">
                        <DownloadReceiptButton invoice={invoice} />
                        {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
                           <button className="tactile-btn text-xs font-semibold text-primary hover:underline cursor-pointer">
                             Pay Now
                           </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
