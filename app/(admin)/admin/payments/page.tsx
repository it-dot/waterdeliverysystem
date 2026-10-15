import { Search, Filter, Receipt } from "lucide-react"
import { getPayments } from "@/lib/services/payments/payments.service"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { RecordPaymentDialog } from "@/components/admin/record-payment-dialog"
import { ExportPaymentsButton } from "@/components/admin/export-payments-button"

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const params = await searchParams;
  const status = params.status || 'all';
  const { data: payments, error } = await getPayments(status)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Payment Transactions</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track collection records, digital payment provider receipts, and payment settlements.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <RecordPaymentDialog />
          <ExportPaymentsButton payments={payments || []} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search payments by ID or customer..."
            className="h-9 w-full rounded-lg border border-border/80 bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-lg border border-border/80 bg-background px-3.5 py-2 text-xs font-medium shadow-xs hover:bg-muted transition-colors outline-none cursor-pointer">
            <Filter className="size-3.5" />
            {status !== 'all' ? `Status: ${status.charAt(0).toUpperCase() + status.slice(1)}` : 'Filter Status'}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <Link href="?">
              <DropdownMenuItem className="cursor-pointer">All Statuses</DropdownMenuItem>
            </Link>
            <Link href="?status=success">
              <DropdownMenuItem className="cursor-pointer">Success</DropdownMenuItem>
            </Link>
            <Link href="?status=pending">
              <DropdownMenuItem className="cursor-pointer">Pending</DropdownMenuItem>
            </Link>
            <Link href="?status=refunded">
              <DropdownMenuItem className="cursor-pointer">Refunded</DropdownMenuItem>
            </Link>
            <Link href="?status=failed">
              <DropdownMenuItem className="cursor-pointer">Failed</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
        {error ? (
           <div className="flex flex-col items-center justify-center p-12 text-center">
             <h3 className="font-semibold text-sm text-red-600">Error loading payments</h3>
             <p className="text-muted-foreground text-xs mt-1 max-w-sm">
               Please check your database connection.
             </p>
           </div>
        ) : !payments || payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted/60 mb-3">
              <Receipt className="size-6 text-muted-foreground opacity-50" />
            </div>
            <h3 className="font-semibold text-sm text-foreground">No payments to show</h3>
            <p className="text-muted-foreground text-xs mt-1 max-w-sm">
              Recent payment transactions will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
             <table className="w-full">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="py-3 px-4">Payment Ref</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Provider</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {payments.map((p) => {
                    const statusLower = p.status.toLowerCase()
                    const statusConfig = 
                      statusLower === 'success' || statusLower === 'paid' ? { dot: 'bg-emerald-500', pill: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' } :
                      statusLower === 'pending' ? { dot: 'bg-amber-500', pill: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20' } :
                      statusLower === 'refunded' ? { dot: 'bg-purple-500', pill: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20' } :
                      { dot: 'bg-red-500', pill: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20' }

                    return (
                    <tr key={p.id} className="transition-colors hover:bg-muted/40">
                      <td className="py-3 px-4 text-xs font-medium">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-muted/60 border border-border/60 text-foreground font-semibold">
                          #{p.id.slice(0, 8).toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-foreground">{p.orders?.profiles?.full_name || 'Unknown'}</td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        <span className="capitalize px-2 py-0.5 rounded bg-muted/50 border border-border/50">{p.provider}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${statusConfig.pill}`}>
                          <span className={`size-1.5 rounded-full ${statusConfig.dot}`} />
                          {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-right font-mono font-medium tabular-nums text-foreground">₱{p.amount.toFixed(2)}</td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</td>
                    </tr>
                  )})}
                </tbody>
             </table>
          </div>
        )}
      </div>
    </div>
  )
}
