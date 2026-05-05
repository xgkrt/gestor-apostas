import { Suspense } from "react"
import { useNavigate } from "react-router-dom"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics"
import { RecentBetsTable } from "@/components/dashboard/RecentBetsTable"
import { MonthlyProfitCalendar } from "@/components/dashboard/MonthlyProfitCalendar"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"
import { BankrollEvolutionChart, ProfitByBookmaker, ProfitByTipster } from "@/components/dashboard/LazyCharts"
import { PeriodFilter } from "@/components/dashboard/PeriodFilter"
import { useDashboardPage } from "./Dashboard/hooks/useDashboardPage"

export default function Dashboard() {
  const { data, computed, handlers } = useDashboardPage()
  const navigate = useNavigate()

  if (data.loadingBankrolls) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-muted-foreground">Carregando bancas...</div>
      </div>
    )
  }

  if (!data.bankrolls || data.bankrolls.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 max-w-md">
          <p className="text-yellow-800">
            Nenhuma banca encontrada. Crie uma banca na página de Bancas para começar.
          </p>
        </div>
      </div>
    )
  }

  if (data.loadingDashboard) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-muted-foreground">Carregando dashboard...</div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      <DashboardHeader
        onNewBet={() => navigate("/nova-aposta")}
        rightContent={<PeriodFilter onChange={handlers.setDateFilter} />}
      />

      {data.dashboard && (
        <>
          <DashboardMetrics
            initialBalance={data.dashboard.initialBalance}
            currentBalance={data.dashboard.currentBalance}
            totalProfit={data.dashboard.totalProfit}
            roi={data.dashboard.roi}
            winRate={data.dashboard.winRate}
            totalBets={data.dashboard.totalBets}
            profitTrend={
              data.dashboard.totalProfit >= 0
                ? `+${computed.profitChangePercent}%`
                : `${computed.profitChangePercent}%`
            }
          />

          <section className="space-y-6">
            <Suspense fallback={<LoadingSkeleton variant="card" className="h-80" />}>
              <BankrollEvolutionChart data={data.dashboard.bankrollEvolution || []} />
            </Suspense>

            <RecentBetsTable bets={computed.recentBets} />

            <Suspense fallback={<LoadingSkeleton variant="card" className="h-80" />}>
              <ProfitByBookmaker data={data.dashboard.profitByBookmaker || []} />
            </Suspense>

            <MonthlyProfitCalendar bets={computed.recentBets} />

            <Suspense fallback={<LoadingSkeleton variant="card" className="h-80" />}>
              <ProfitByTipster data={data.dashboard.profitByTipster || []} />
            </Suspense>
          </section>
        </>
      )}
    </div>
  )
}
