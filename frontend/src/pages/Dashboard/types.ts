import type { Bankroll, Bet, Dashboard } from "@/types"
import type { DashboardDateFilter } from "@/components/dashboard/PeriodFilter"

export interface DashboardPageState {
  selectedBankrollId: number | null
  dateFilter: DashboardDateFilter
}

export interface DashboardPageComputed {
  selectedBankroll: Bankroll | undefined
  recentBets: Bet[]
  profitChangePercent: string
}

export interface DashboardPageData {
  bankrolls: Bankroll[] | undefined
  dashboard: Dashboard | undefined
  loadingBankrolls: boolean
  loadingDashboard: boolean
}
