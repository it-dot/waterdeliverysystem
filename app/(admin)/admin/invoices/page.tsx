import { Search, Filter, Receipt, FileText } from "lucide-react"
import { getInvoices } from "@/lib/services/invoices/invoices.service"
import { CreateInvoiceDialog } from "@/components/admin/create-invoice-dialog"
import { InvoiceActions } from "@/components/admin/invoice-actions"

export default async function InvoicesPage() {
  const { data: invoices, error } = await getInvoices()

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
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Invoices & Billing</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Generate, send, and audit commercial customer invoices.
          </p>
        </div>
        <CreateInvoiceDialog />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search invoices by number or customer..."
            className="h-9 w-full rounded-lg border border-border/80 bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
          />
        </div>
      </div>

      <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
        {error ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
             <h3 className="font-semibold text-sm text-red-600">Error loading invoices</h3>
             <p className="text-muted-foreground text-xs mt-1 max-w-sm">
               {error}
             </p>
           </div>
        ) : !invoices || invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
             <div className="flex size-12 items-center justify-center rounded-full bg-muted/60 mb-3">
               <Receipt className="size-6 text-muted-foreground opacity-50" />
             </div>
             <h3 className="font-semibold text-sm text-foreground">No invoices yet</h3>
             <p className="text-muted-foreground text-xs mt-1 max-w-sm">
               Generate an invoice to get started.
             </p>
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3 px-4">Invoice No.</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {invoices.map((invoice: any) => (
                  <tr key={invoice.id} className="transition-colors hover:bg-muted/40">
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-muted/60 border border-border/60 text-foreground font-semibold inline-flex items-center gap-1.5">
                        <FileText className="size-3 text-muted-foreground" />
                        {invoice.invoice_number}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-foreground">
                      {invoice.profiles?.full_name || invoice.profiles?.email || 'Unknown'}
                    </td>
                    <td className="py-3 px-4">
                      {formatStatus(invoice.status)}
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium tabular-nums text-right text-foreground">
                      ₱{invoice.total_amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {new Date(invoice.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <InvoiceActions invoiceId={invoice.id} status={invoice.status} />
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
