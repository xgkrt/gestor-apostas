import { cn } from "@/lib/utils"

interface ProgressBarProps {
  label: string
  value: number
  percentage: number
  className?: string
  barClassName?: string
}

export function ProgressBar({ 
  label, 
  value, 
  percentage, 
  className,
  barClassName 
}: ProgressBarProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-400 font-bold">
          R$ {value.toFixed(2)}
        </span>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full bg-blue-600 rounded-full transition-all duration-1000",
            barClassName
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
