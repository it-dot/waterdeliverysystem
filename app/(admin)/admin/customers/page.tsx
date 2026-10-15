import { Search, MoreHorizontal, UserX } from "lucide-react"
import { getCustomers } from "@/lib/services/customers/customers.service"

import { AddCustomerDialog } from "@/components/admin/add-customer-dialog"
import { CustomerActions } from "@/components/admin/customer-actions"

export default async function CustomersPage() {
  const { data: customers, error } = await getCustomers()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Customers</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your customer database, contact details, and account status.
          </p>
        </div>
        <AddCustomerDialog />
      </div>

      {/* Search & filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search customers..."
            className="h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Customer table */}
      <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
        {error ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <h3 className="font-semibold text-sm text-red-600">Error loading customers</h3>
            <p className="text-muted-foreground text-xs mt-1 max-w-sm">
              Please check your database connection or environment variables.
            </p>
          </div>
        ) : !customers || customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted/60 mb-3">
              <UserX className="size-6 text-muted-foreground opacity-50" />
            </div>
            <h3 className="font-semibold text-sm text-foreground">No customers found</h3>
            <p className="text-muted-foreground text-xs mt-1 max-w-sm">
              Get started by adding your first customer account.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Address</th>
                  <th className="py-3 px-4 text-center">Orders</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {customers.map((customer: any) => {
                  const name = customer.full_name || 'Unnamed'
                  const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
                  const isActive = customer.status === 'Active' || !customer.status

                  return (
                    <tr
                      key={customer.id}
                      className="transition-colors hover:bg-muted/40"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary shrink-0">
                            {initials || "CU"}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{name}</p>
                            <p className="text-[11px] font-mono text-muted-foreground">
                              #{customer.id.slice(0, 8).toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm text-foreground">{customer.email}</p>
                          <p className="text-xs text-muted-foreground">
                            {customer.phone || 'No phone'}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground max-w-[220px] truncate">
                        {customer.address || 'No address provided'}
                      </td>
                      <td className="py-3 px-4 text-sm text-center font-mono font-medium tabular-nums text-foreground">
                        {customer.totalOrders || 0}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                            isActive
                              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                              : 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20'
                          }`}
                        >
                          <span className={`size-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          {customer.status || 'Active'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <CustomerActions customer={customer} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
