import { getCustomerOrders } from "@/lib/actions/customer"
import { CustomerCreateOrderDialog } from "@/components/customer/customer-create-order-dialog"
import { Package, MapPin, Plus, Clock, CheckCircle2, ShoppingCart, Truck, Phone } from "lucide-react"

export default async function CustomerOrdersPage() {
  const { data: orders, error } = await getCustomerOrders()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">My Water Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track active deliveries and review previous water bottle fulfillment history.
          </p>
        </div>
        <CustomerCreateOrderDialog trigger={
          <button className="tactile-btn inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 cursor-pointer">
            <Plus className="size-4" />
            Order Water Refill
          </button>
        } />
      </div>

      <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
        {error ? (
          <div className="p-12 text-center text-sm font-medium text-red-600">
            Error loading orders. Please check connection.
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted/60 mb-3">
              <Package className="size-6 text-muted-foreground opacity-50" />
            </div>
            <h3 className="font-semibold text-sm text-foreground">No orders yet</h3>
            <p className="text-muted-foreground text-xs mt-1 max-w-sm">
              Place your first water delivery order to get started.
            </p>
            <div className="mt-4">
              <CustomerCreateOrderDialog trigger={
                <button className="tactile-btn inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 cursor-pointer">
                  <Plus className="size-3.5" />
                  Order Now
                </button>
              } />
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {orders.map((order: any) => {
              const status = order.status.toLowerCase()
              const statusConfig = 
                status === 'delivered' ? { dot: 'bg-emerald-500', pill: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' } :
                status === 'in-transit' ? { dot: 'bg-blue-500', pill: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20' } :
                status === 'pending' ? { dot: 'bg-amber-500', pill: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20' } :
                status === 'processing' ? { dot: 'bg-purple-500', pill: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20' } :
                { dot: 'bg-red-500', pill: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20' }

              const delivery = Array.isArray(order.deliveries) ? order.deliveries[0] : order.deliveries
              const rider = delivery?.profiles

              return (
                <div key={order.id} className="p-5 transition-colors hover:bg-muted/30">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-muted/60 border border-border/60 text-foreground font-semibold">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${statusConfig.pill}`}>
                        <span className={`size-1.5 rounded-full ${statusConfig.dot}`} />
                        {order.status.replace('-', ' ').toUpperCase()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Placed {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="text-left md:text-right">
                      <span className="font-mono text-lg font-bold tabular-nums text-foreground">
                        ₱{order.total_amount.toFixed(2)}
                      </span>
                      <span className="block text-xs text-muted-foreground capitalize">
                        Payment: {order.payment_status || 'Pending'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-border/50 text-xs">
                    <div className="rounded-lg bg-muted/30 p-3 border border-border/50">
                      <h4 className="font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-primary" /> Delivery Destination
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {order.delivery_address?.includes('|') ? order.delivery_address.split('|')[1] : (order.delivery_address || 'Address on file')}
                      </p>
                    </div>

                    <div className="rounded-lg bg-muted/30 p-3 border border-border/50">
                      <h4 className="font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                        <Package className="size-3.5 text-primary" /> Ordered Items
                      </h4>
                      <ul className="space-y-1">
                        {order.order_items?.map((item: any, idx: number) => (
                          <li key={idx} className="flex justify-between items-center text-muted-foreground">
                            <span>{item.quantity}x {item.products?.name || 'Water Item'}</span>
                            <span className="font-mono tabular-nums font-medium text-foreground">₱{(item.quantity * item.price_at_time).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-lg bg-muted/30 p-3 border border-border/50">
                      <h4 className="font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                        <Truck className="size-3.5 text-primary" /> Assigned Courier
                      </h4>
                      {rider ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-foreground">{rider.full_name}</span>
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                              <span className="size-1 rounded-full bg-emerald-500" />
                              {delivery?.status?.replace('-', ' ') || 'Assigned'}
                            </span>
                          </div>
                          {rider.phone && (
                            <div className="flex items-center justify-between pt-1 border-t border-border/50">
                              <span className="font-mono text-muted-foreground">{rider.phone}</span>
                              <a
                                href={`tel:${rider.phone}`}
                                className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                              >
                                <Phone className="size-3" /> Call
                              </a>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-muted-foreground pt-1">
                          {order.status === 'delivered' ? 'Fulfilled by station fleet' : 'Pending courier assignment'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
