import { memo } from "react"
import { Card } from "@/components/ui/card"
import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  label: string
  value: string
  valueClassName?: string
  icon?: LucideIcon
  trend?: string
  trendDirection?: "up" | "down"
  className?: string
}

// Memoized to prevent unnecessary re-renders when parent updates
export const MetricCard = memo(function MetricCard({ 
  label, 
  value, 
  valueClassName,
  icon: Icon, 
  trend, 
  trendDirection = "up",
  className 
}: MetricCardProps) {
  return (
    <Card className={cn(
      "bg-card/95 text-card-foreground p-4 sm:p-6 rounded-2xl border border-border/80 shadow-[0_10px_24px_-14px_rgba(15,23,42,0.3),0_2px_5px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-16px_rgba(15,23,42,0.35),0_6px_10px_-8px_rgba(15,23,42,0.15)] dark:border-border/90 dark:bg-card/95 dark:shadow-[0_16px_36px_-22px_rgba(2,6,23,0.95),0_6px_14px_rgba(2,6,23,0.65)] dark:hover:shadow-[0_20px_42px_-22px_rgba(2,6,23,0.98),0_8px_18px_rgba(2,6,23,0.72)]",
      className
    )}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-muted/85 border border-border/60 flex items-center justify-center dark:bg-muted/80 dark:border-border/90">
            <Icon className="w-4 h-4 text-muted-foreground" />
          </div>
        )}
      </div>
      
      <div className="flex items-end justify-between">
        <h3 className={cn("text-xl font-bold text-card-foreground sm:text-2xl", valueClassName)}>{value}</h3>
        {trend && (
          <span className={cn(
            "text-[10px] font-bold px-2 py-1 rounded-full mb-1",
            trendDirection === "up" 
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/18 dark:text-emerald-300" 
              : "bg-red-50 text-red-700 dark:bg-red-500/18 dark:text-red-300"
          )}>
            {trend}
          </span>
        )}
      </div>
    </Card>
  )
})
