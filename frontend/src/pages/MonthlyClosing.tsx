import { useEffect, useMemo, useState } from "react"
import { addMonths, format, subMonths } from "date-fns"
import {
  CalendarCheck,
  CalendarDays,
  ChartNoAxesCombined,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Receipt,
  Sigma,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MetricCard } from "@/components/dashboard/MetricCard"
import { useBankrolls, useBets } from "@/services/queries"
import { DayHighlightsCard, HighestGreenCard, SportResultsCard } from "./MonthlyClosing/components"
import {
  ALL_PERIODS,
  buildMonthlySummary,
  formatCurrency,
  formatMonthLabel,
  formatOdd,
  formatPercent,
  formatPeriodLabel,
  formatUnits,
  METRIC_CARD_CLASS,
  parseBetDate,
  parseMonthValue,
} from "./MonthlyClosing/utils"

export default function MonthlyClosing() {
  const currentMonth = format(new Date(), "yyyy-MM")
  const [selectedBankrollId, setSelectedBankrollId] = useState<number | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<string>(currentMonth)

  const { data: bankrolls, isLoading: loadingBankrolls } = useBankrolls()
  const { data: bets, isLoading: loadingBets } = useBets(
    selectedBankrollId ?? undefined,
    Boolean(selectedBankrollId)
  )

  useEffect(() => {
    if (selectedBankrollId || !bankrolls || bankrolls.length === 0) return
    setSelectedBankrollId(bankrolls[0].id)
  }, [bankrolls, selectedBankrollId])

  const selectedBankroll = useMemo(
    () => bankrolls?.find((bankroll) => bankroll.id === selectedBankrollId),
    [bankrolls, selectedBankrollId]
  )

  const periodOptions = useMemo(() => {
    const monthSet = new Set<string>([currentMonth])

    for (const bet of bets || []) {
      const betDate = parseBetDate(bet.betDate)
      if (betDate) {
        monthSet.add(format(betDate, "yyyy-MM"))
      }
    }

    return Array.from(monthSet).sort((a, b) => b.localeCompare(a))
  }, [bets, currentMonth])

  useEffect(() => {
    if (selectedPeriod === ALL_PERIODS || periodOptions.includes(selectedPeriod)) return
    setSelectedPeriod(periodOptions[0] || currentMonth)
  }, [currentMonth, periodOptions, selectedPeriod])

  const monthlySummary = useMemo(
    () =>
      buildMonthlySummary({
        bets: bets || [],
        selectedPeriod,
        initialBankrollBalance: selectedBankroll?.initialBalance ?? 0,
      }),
    [bets, selectedBankroll?.initialBalance, selectedPeriod]
  )

  const canNavigateMonths = selectedPeriod !== ALL_PERIODS

  const handlePreviousMonth = () => {
    if (!canNavigateMonths) return
    setSelectedPeriod(format(subMonths(parseMonthValue(selectedPeriod), 1), "yyyy-MM"))
  }

  const handleNextMonth = () => {
    if (!canNavigateMonths) return
    setSelectedPeriod(format(addMonths(parseMonthValue(selectedPeriod), 1), "yyyy-MM"))
  }

  if (loadingBankrolls) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
        Carregando bancas...
      </div>
    )
  }

  if (!bankrolls || bankrolls.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md rounded-2xl border border-yellow-200 bg-yellow-50 p-6 text-yellow-800">
          Nenhuma banca encontrada. Crie uma banca na pagina de Bancas para gerar fechamentos mensais.
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Fechamento de Mes</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Resumo dinamico por banca para acompanhar resultado, volume e destaques.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-[minmax(220px,280px)_minmax(0,460px)] lg:w-auto">
          <Select
            value={selectedBankrollId?.toString() || ""}
            onValueChange={(value) => setSelectedBankrollId(Number(value))}
          >
            <SelectTrigger className="h-11 rounded-xl border-border bg-card text-foreground" aria-label="Banca">
              <SelectValue placeholder="Selecione uma banca">
                {selectedBankroll?.name}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {bankrolls.map((bankroll) => (
                <SelectItem key={bankroll.id} value={bankroll.id.toString()}>
                  {bankroll.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="grid grid-cols-[44px_1fr_44px] items-center overflow-hidden rounded-xl border border-border bg-card text-foreground shadow-sm">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handlePreviousMonth}
              disabled={!canNavigateMonths}
              className="h-11 rounded-none border-r border-border"
              aria-label="Mes anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger
                className="h-11 rounded-none border-0 bg-card px-3 text-foreground shadow-none focus:ring-0"
                aria-label="Periodo"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_PERIODS}>Todos os meses</SelectItem>
                {periodOptions.map((period) => (
                  <SelectItem key={period} value={period}>
                    {formatMonthLabel(period)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleNextMonth}
              disabled={!canNavigateMonths}
              className="h-11 rounded-none border-l border-border"
              aria-label="Proximo mes"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {loadingBets ? (
        <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
          Carregando apostas...
        </div>
      ) : (
        <>
          <Card className="rounded-2xl border-border bg-card p-4 text-card-foreground shadow-sm sm:rounded-3xl sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-muted p-2 text-muted-foreground">
                  <CalendarCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold capitalize text-foreground">
                    {formatPeriodLabel(selectedPeriod)}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedBankroll?.name || "Banca selecionada"}
                  </p>
                </div>
              </div>

              {monthlySummary.totalBets === 0 && (
                <span className="text-sm text-muted-foreground">Nenhuma aposta neste periodo</span>
              )}
            </div>
          </Card>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Saldo inicial"
              value={formatCurrency(monthlySummary.initialBalance)}
              trend={formatUnits(monthlySummary.initialBalance)}
              icon={Wallet}
              className={METRIC_CARD_CLASS}
            />
            <MetricCard
              label="Saldo final"
              value={formatCurrency(monthlySummary.finalBalance)}
              trend={formatUnits(monthlySummary.finalBalance)}
              icon={CircleDollarSign}
              className={METRIC_CARD_CLASS}
            />
            <MetricCard
              label="Lucro / Prejuizo"
              value={formatCurrency(monthlySummary.periodProfit)}
              valueClassName={monthlySummary.periodProfit >= 0 ? "text-emerald-600 dark:text-emerald-300" : "text-red-600 dark:text-rose-300"}
              icon={monthlySummary.periodProfit >= 0 ? TrendingUp : TrendingDown}
              trend={formatUnits(monthlySummary.periodProfit)}
              trendDirection={monthlySummary.periodProfit >= 0 ? "up" : "down"}
              className={METRIC_CARD_CLASS}
            />
            <MetricCard
              label="ROI"
              value={formatPercent(monthlySummary.roi)}
              valueClassName={monthlySummary.roi >= 0 ? "text-emerald-600 dark:text-emerald-300" : "text-red-600 dark:text-rose-300"}
              icon={ChartNoAxesCombined}
              className={METRIC_CARD_CLASS}
            />
            <MetricCard
              label="Volume apostado"
              value={formatCurrency(monthlySummary.totalInvested)}
              trend={formatUnits(monthlySummary.totalInvested)}
              icon={Receipt}
              className={METRIC_CARD_CLASS}
            />
            <MetricCard
              label="Quantidade de apostas"
              value={monthlySummary.totalBets.toString()}
              trend={`${monthlySummary.finishedBets} finalizadas`}
              icon={CalendarDays}
              className={METRIC_CARD_CLASS}
            />
            <MetricCard
              label="Media das odds"
              value={formatOdd(monthlySummary.averagePeriodOdd)}
              trend={`Total ${formatOdd(monthlySummary.averageTotalOdd)}`}
              icon={Sigma}
              className={METRIC_CARD_CLASS}
            />
            <HighestGreenCard bet={monthlySummary.highestGreenOddBet} />
          </section>

          <section>
            <DayHighlightsCard bestDay={monthlySummary.bestDay} worstDay={monthlySummary.worstDay} />
          </section>

          <section>
            <SportResultsCard sportResults={monthlySummary.sportResults} />
          </section>
        </>
      )}
    </div>
  )
}
