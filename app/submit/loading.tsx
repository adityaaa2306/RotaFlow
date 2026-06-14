import { Skeleton } from "@/components/ui/skeleton";

function FormCardSkeleton({ fields }: { fields: number }) {
  return (
    <div className="lux-card">
      <Skeleton className="h-5 w-48" />
      <div className="mt-4 space-y-4">
        {Array.from({ length: fields }).map((_, index) => (
          <div key={index}>
            <Skeleton className="mb-1 h-4 w-24" />
            <Skeleton className="h-11 w-full rounded-2xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SubmitLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-8">
      <div className="border-b border-slate-200 pb-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>

      <Skeleton className="h-11 w-80 rounded-full" />

      <FormCardSkeleton fields={4} />
      <FormCardSkeleton fields={3} />
      <FormCardSkeleton fields={2} />

      <Skeleton className="h-11 w-44 rounded-full" />
    </div>
  );
}
