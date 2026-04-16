import { cn } from '../../utils/cn'

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn('skeleton rounded-xl', className)} />
)

export const ProductCardSkeleton = () => (
  <div className="card p-0 overflow-hidden">
    <Skeleton className="h-52 w-full rounded-none rounded-t-2xl" />
    <div className="p-5 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 w-9" />
      </div>
    </div>
  </div>
)

export const StatCardSkeleton = () => (
  <div className="card p-6 space-y-3">
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-8 w-16" />
    <Skeleton className="h-3 w-32" />
  </div>
)
