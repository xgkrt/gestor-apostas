import { memo } from "react"
import { cn } from "@/lib/utils"

interface LoadingSkeletonProps {
  className?: string
  variant?: "default" | "card" | "text" | "circle" | "button"
  count?: number
}

/**
 * LoadingSkeleton - Componente de skeleton screen para estados de carregamento
 * Memoizado para otimização de performance
 */
export const LoadingSkeleton = memo(function LoadingSkeleton({
  className,
  variant = "default",
  count = 1,
}: LoadingSkeletonProps) {
  const baseClasses = "animate-pulse bg-slate-200 dark:bg-slate-700 rounded-lg"

  const variantClasses = {
    default: "h-4 w-full",
    card: "h-32 w-full",
    text: "h-3 w-full",
    circle: "h-12 w-12 rounded-full",
    button: "h-10 w-24",
  }

  const skeletons = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={cn(baseClasses, variantClasses[variant], className)}
      aria-label="Carregando..."
      role="status"
    />
  ))

  return count === 1 ? skeletons[0] : <div className="space-y-3">{skeletons}</div>
})

/**
 * DashboardSkeleton - Skeleton específico para a página Dashboard
 */
export function DashboardSkeleton() {
  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <LoadingSkeleton className="h-8 w-48" />
        <LoadingSkeleton className="h-4 w-96" />
      </div>

      {/* Bankroll Selector Skeleton */}
      <LoadingSkeleton className="h-11 w-64" variant="button" />

      {/* Metrics Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <LoadingSkeleton variant="card" className="h-28" />
        <LoadingSkeleton variant="card" className="h-28" />
        <LoadingSkeleton variant="card" className="h-28" />
        <LoadingSkeleton variant="card" className="h-28" />
      </div>

      {/* Charts Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LoadingSkeleton variant="card" className="h-80" />
        </div>
        <div>
          <LoadingSkeleton variant="card" className="h-80" />
        </div>
      </div>

      {/* Recent Bets Table Skeleton */}
      <LoadingSkeleton variant="card" className="h-64" />
    </div>
  )
}

/**
 * BankrollsSkeleton - Skeleton específico para a página Bankrolls
 */
export function BankrollsSkeleton() {
  return (
    <div className="space-y-6 w-full animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <LoadingSkeleton className="h-9 w-32" />
        <LoadingSkeleton className="h-11 w-36" variant="button" />
      </div>

      {/* Bankroll Cards Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <LoadingSkeleton variant="card" className="h-56" />
        <LoadingSkeleton variant="card" className="h-56" />
        <LoadingSkeleton variant="card" className="h-56" />
      </div>
    </div>
  )
}

/**
 * BetsSkeleton - Skeleton específico para a página Bets
 */
export function BetsSkeleton() {
  return (
    <div className="space-y-6 w-full animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <LoadingSkeleton className="h-9 w-32" />
        <LoadingSkeleton className="h-11 w-36" variant="button" />
      </div>

      {/* Table Skeleton */}
      <div className="bg-white border-slate-100 rounded-3xl overflow-hidden shadow-sm p-6 space-y-4">
        <LoadingSkeleton className="h-6 w-40" />
        <div className="space-y-3">
          <LoadingSkeleton className="h-12 w-full" count={5} />
        </div>
      </div>
    </div>
  )
}

/**
 * PageLoadingSkeleton - Skeleton genérico para páginas
 */
export function PageLoadingSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
      <div className="space-y-4 text-center">
        <LoadingSkeleton variant="circle" className="mx-auto" />
        <LoadingSkeleton className="h-4 w-48 mx-auto" />
      </div>
    </div>
  )
}
