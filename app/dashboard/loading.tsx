import { Skeleton } from "@/components/ui/skeleton";

function StatCardSkeleton() {
  return (
    <div className="lux-card">
      <Skeleton className="h-8 w-8 rounded-2xl" />
      <Skeleton className="mt-4 h-9 w-20" />
      <Skeleton className="mt-2 h-4 w-28" />
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      <div className="border-b border-slate-200 pb-6">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="mt-2 h-4 w-48" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="lux-card">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-4 h-72 w-full rounded-2xl" />
        </div>
        <div className="lux-card">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="mt-4 h-72 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
