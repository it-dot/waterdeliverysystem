import { Skeleton } from "@/components/ui/skeleton"

export default function CustomerLoading() {
  return (
    <div className="space-y-6 w-full animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <Skeleton className="h-9 w-36 rounded-lg" />
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="size-9 rounded-lg" />
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        ))}
      </div>

      {/* Stepper & Details */}
      <div className="grid gap-6 lg:grid-cols-7">
        <div className="rounded-xl border border-border/80 bg-card shadow-xs p-6 lg:col-span-4 space-y-6">
          <div className="flex items-center gap-3 border-b border-border/60 pb-4">
            <Skeleton className="size-9 rounded-lg" />
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-56" />
            </div>
          </div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex justify-between items-center py-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-36" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border/80 bg-card shadow-xs p-6 lg:col-span-3 space-y-4">
          <div className="border-b border-border/60 pb-3">
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

