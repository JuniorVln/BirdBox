import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function LeadCardSkeleton() {
  return (
    <Card className="bg-surface border-border">
      <CardContent className="p-5">
        <div className="mb-3">
          <Skeleton className="h-5 w-3/4 bg-surface-raised" />
          <Skeleton className="h-5 w-16 mt-2 bg-surface-raised" />
        </div>
        <Skeleton className="h-4 w-1/2 mb-3 bg-surface-raised" />
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full bg-surface-raised" />
          <Skeleton className="h-4 w-2/3 bg-surface-raised" />
        </div>
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-5 w-20 bg-surface-raised" />
          <Skeleton className="h-5 w-16 bg-surface-raised" />
        </div>
        <Skeleton className="h-9 w-full bg-surface-raised" />
      </CardContent>
    </Card>
  )
}

export function LeadCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <LeadCardSkeleton key={i} />
      ))}
    </div>
  )
}
