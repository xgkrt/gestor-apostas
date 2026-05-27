import { MetricCard } from "./MetricCard"
import { Wallet, TrendingUp, Percent, Target, BarChart3 } from "lucide-react"

interface DashboardMetricsProps {
  initialBalance: number
  currentBalance: number
  totalProfit: number
  roi: number
  winRate: number
  totalBets: number
  profitTrend?: string
}

const UNIT_VALUE = 50

function formatUnits(value: number): string {
  const units = value / UNIT_VALUE
  const sign = units > 0 ? "+" : ""
  return `${sign}${units.toFixed(2)}u`
}

export function DashboardMetrics({
  initialBalance,
  currentBalance,
  totalProfit,
  roi,
  winRate,
  totalBets,
  profitTrend
}: DashboardMetricsProps) {
  const totalAllTimeProfit = currentBalance - initialBalance
  const isProfitPositive = totalProfit >= 0
  const isTotalUnitsPositive = totalAllTimeProfit >= 0
  const isMonthlyUnitsPositive = totalProfit >= 0
  const isRoiPositive = roi >= 0

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      <MetricCard
        label="Banca Atual"
        value={`R$ ${currentBalance.toFixed(2)}`}
        icon={Wallet}
      />
      
      <MetricCard
        label="Lucro/Prejuízo"
        value={`R$ ${totalProfit.toFixed(2)}`}
        icon={TrendingUp}
        trend={profitTrend}
        trendDirection={isProfitPositive ? "up" : "down"}
      />
      
      <MetricCard
        label="ROI Global"
        value={`${isRoiPositive ? '+' : ''}${roi.toFixed(1)}%`}
        icon={Percent}
        valueClassName={isRoiPositive ? "text-emerald-600" : "text-red-600"}
      />
      
      <MetricCard
        label="Win Rate"
        value={`${winRate.toFixed(0)}%`}
        icon={Target}
      />

      <MetricCard
        label="Lucro Total (u)"
        value={formatUnits(totalAllTimeProfit)}
        icon={TrendingUp}
        valueClassName={isTotalUnitsPositive ? "text-emerald-600" : "text-red-600"}
      />

      <MetricCard
        label="Lucro Mensal (u)"
        value={formatUnits(totalProfit)}
        icon={TrendingUp}
        valueClassName={isMonthlyUnitsPositive ? "text-emerald-600" : "text-red-600"}
      />

      <MetricCard
        label="Numero de Apostas"
        value={totalBets.toLocaleString("pt-BR")}
        icon={BarChart3}
      />
    </section>
  )
}
