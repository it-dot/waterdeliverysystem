import { Skeleton } from "@/components/ui/skeleton"

export default function RiderLoading() {
  return (
    <div className="space-y-6 w-full animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>

      {/* 4 Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="size-8 rounded-lg" />
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>

      {/* Stop #1 Courier Card */}
      <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border/80 bg-muted/20 px-6 py-4">
          <Skeleton className="size-9 rounded-lg" />
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row items-start gap-4">
            <Skeleton className="size-12 rounded-xl shrink-0" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-72" />
              <div className="flex gap-2 pt-1">
                <Skeleton className="h-9 w-32 rounded-lg" />
                <Skeleton className="h-9 w-36 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
