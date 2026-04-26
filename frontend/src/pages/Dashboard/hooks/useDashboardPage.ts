import { useEffect, useMemo, useState } from "react"
import { useBankrolls, useBets, useDashboard } from "@/services/queries"
import {
  getDefaultDashboardDateFilter,
  type DashboardDateFilter,
} from "@/components/dashboard/PeriodFilter"
import { DASHBOARD_PREFERRED_BANKROLL_KEY } from "@/constants/dashboard"
import type { DashboardPageComputed, DashboardPageData, DashboardPageState } from "../types"

export function useDashboardPage() {
  const [selectedBankrollId, setSelectedBankrollId] = useState<number | null>(null)
  const [dateFilter, setDateFilter] = useState<DashboardDateFilter>(getDefaultDashboardDateFilter())

  const { data: bankrolls, isLoading: loadingBankrolls } = useBankrolls()
  const { data: dashboard, isLoading: loadingDashboard } = useDashboard(
    selectedBankrollId ?? undefined,
    dateFilter.startDate,
    dateFilter.endDate
  )
  const { data: allBets } = useBets(selectedBankrollId ?? undefined)

  useEffect(() => {
    if (selectedBankrollId || !bankrolls || bankrolls.length === 0) return

    const storedValue = window.localStorage.getItem(DASHBOARD_PREFERRED_BANKROLL_KEY)
    const preferredBankrollId = storedValue ? Number(storedValue) : null

    if (
      preferredBankrollId &&
      bankrolls.some((bankroll) => bankroll.id === preferredBankrollId)
    ) {
      setSelectedBankrollId(preferredBankrollId)
      return
    }

    setSelectedBankrollId(bankrolls[0].id)
  }, [selectedBankrollId, bankrolls])

  useEffect(() => {
    if (!selectedBankrollId) return
    window.localStorage.setItem(DASHBOARD_PREFERRED_BANKROLL_KEY, String(selectedBankrollId))
  }, [selectedBankrollId])

  const selectedBankroll = useMemo(
    () => bankrolls?.find((bankroll) => bankroll.id === selectedBankrollId),
    [bankrolls, selectedBankrollId]
  )

  const recentBets = allBets || []

  const profitChangePercent =
    selectedBankroll && dashboard
      ? (dashboard.totalProfit / selectedBankroll.initialBalance) * 100
      : 0

  const state: DashboardPageState = {
    selectedBankrollId,
    dateFilter,
  }

  const data: DashboardPageData = {
    bankrolls,
    dashboard,
    loadingBankrolls,
    loadingDashboard,
  }

  const computed: DashboardPageComputed = {
    selectedBankroll,
    recentBets,
    profitChangePercent: profitChangePercent.toFixed(1),
  }

  return {
    state,
    data,
    computed,
    handlers: {
      setSelectedBankrollId,
      setDateFilter,
    },
  }
}
