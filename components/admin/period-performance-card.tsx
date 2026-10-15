"use client"

import { useState } from "react"
import { Activity, Truck, Package, DollarSign, ArrowUpRight } from "lucide-react"
import Link from "next/link"

interface SummaryData {
  deliveriesCompleted: number
  newOrders: number
  collections: number
}

interface PeriodPerformanceCardProps {
  summaries: {
    daily: SummaryData
    weekly: SummaryData
    monthly: SummaryData
    yearly: SummaryData
  }
}

type Period = "daily" | "weekly" | "monthly" | "yearly"

const PERIOD_LABELS: Record<Period, { title: string; subtitle: string }> = {
  daily: { title: "Today's Performance", subtitle: "Live operations for today" },
  weekly: { title: "This Week's Performance", subtitle: "Rolling 7-day performance" },
  monthly: { title: "This Month's Performance", subtitle: "Calendar month to date" },
  yearly: { title: "This Year's Performance", subtitle: "Annual cumulative metrics" },
}

export function PeriodPerformanceCard({ summaries }: PeriodPerformanceCardProps) {
  const [activePeriod, setActivePeriod] = useState<Period>("daily")
  const current = summaries[activePeriod]

  return (
    <div className="rounded-xl border border-border/80 bg-card shadow-xs transition-all duration-200">
      {/* Header with segmented pill switcher */}
      <div className="border-b border-border/70 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Activity className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Operational Performance</h3>
              <p className="text-xs text-muted-foreground">{PERIOD_LABELS[activePeriod].subtitle}</p>
            </div>
          </div>

          {/* Segmented Control (UIverse / Shadcn style) */}
          <div className="inline-flex rounded-lg border border-border/60 bg-muted/50 p-0.5">
            {(["daily", "weekly", "monthly", "yearly"] as const).map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setActivePeriod(period)}
                className={`relative px-2.5 py-1 text-xs font-medium capitalize rounded-md transition-all duration-150 ${
                  activePeriod === period
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metric Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/60 p-1">
        {/* Deliveries Completed */}
        <div className="p-4 flex flex-col justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Truck className="size-3.5" />
            <span>Deliveries</span>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight font-mono tabular-nums text-foreground">
              {current.deliveriesCompleted}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Completed drops</p>
          </div>
        </div>

        {/* New Orders */}
        <div className="p-4 flex flex-col justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Package className="size-3.5" />
            <span>New Orders</span>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight font-mono tabular-nums text-foreground">
              {current.newOrders}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Total booked</p>
          </div>
        </div>

        {/* Collections / Revenue */}
        <div className="p-4 flex flex-col justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <DollarSign className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Collections</span>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
              ₱{current.collections.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Cash & digital settled</p>
          </div>
        </div>
      </div>

      {/* Footer link to full reports */}
      <div className="border-t border-border/60 bg-muted/20 px-5 py-3 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Real-time telemetry updated continuously</span>
        <Link
          href={`/admin/reports?timeframe=${activePeriod}`}
          className="inline-flex items-center gap-1 font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View detailed analytics
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </div>
  )
}
