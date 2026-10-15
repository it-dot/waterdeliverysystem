import { Search, Filter } from "lucide-react"
import { getRecentOrders } from "@/lib/services/orders/orders.service"

import { CreateOrderDialog } from "@/components/admin/create-order-dialog"
import { OrdersTable } from "@/components/admin/orders-table"

export default async function OrdersPage() {
  const { data: orders, error } = await getRecentOrders(50)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage, filter, and track all customer water delivery orders.
          </p>
        </div>
        <CreateOrderDialog />
      </div>

      <OrdersTable orders={orders || []} error={error} />
    </div>
  )
}
