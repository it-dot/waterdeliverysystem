import { Skeleton } from "@/components/ui/skeleton"

export default function AdminLoading() {
  return (
    <div className="space-y-6 w-full animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <Skeleton className="h-9 w-36 rounded-lg" />
      </div>

      {/* 4 KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="size-9 rounded-lg" />
            </div>
            <div className="space-y-1.5 pt-1">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Table / Hub Area */}
      <div className="rounded-xl border border-border/80 bg-card shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-8 w-48 rounded-lg" />
        </div>
        <div className="space-y-3 pt-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}

