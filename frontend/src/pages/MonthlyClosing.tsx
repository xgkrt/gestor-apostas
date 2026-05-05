import { useEffect, useMemo, useState } from "react"
import { addMonths, endOfMonth, format, parse, parseISO, startOfMonth, subMonths } from "date-fns"
import { ptBR } from "date-fns/locale"
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

const UNIT_VALUE = 50
const ALL_PERIODS = "ALL"
const METRIC_CARD_CLASS = "h-[150px]"

interface Highlight {
  label: string
  value: number
}

interface SportResult {
  sport: string
  profit: number
}

interface HighestGreenOdd {
  event: string
  odd: number
  stake: number
  profit: number
}

function parseBetDate(value: string): Date | null {
  const brDate = parse(value, "dd/MM/yyyy", new Date())
  if (!Number.isNaN(brDate.getTime())) return brDate

  const isoDate = parseISO(value)
  if (!Number.isNaN(isoDate.getTime())) return isoDate

  const fallback = new Date(value)
  if (!Number.isNaN(fallback.getTime())) return fallback

  return null
}

function parseMonthValue(month: string): Date {
  const parsedMonth = parse(`${month}-01`, "yyyy-MM-dd", new Date())
  return Number.isNaN(parsedMonth.getTime()) ? startOfMonth(new Date()) : parsedMonth
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function formatPercent(value: number): string {
  return `${value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`
}

function formatUnits(value: number): string {
  const units = value / UNIT_VALUE
  const sign = units > 0 ? "+" : ""
  return `${sign}${units.toFixed(2)}u`
}

function formatOdd(value: number | null): string {
  if (value === null) return "--"

  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function formatMonthLabel(month: string): string {
  return format(parseMonthValue(month), "MMMM 'de' yyyy", { locale: ptBR })
}

function formatPeriodLabel(period: string): string {
  return period === ALL_PERIODS ? "Todos os meses" : formatMonthLabel(period)
}

function getBestAndWorst(map: Map<string, number>): { best: Highlight | null; worst: Highlight | null } {
  const entries = Array.from(map.entries())
  if (entries.length === 0) return { best: null, worst: null }

  const sorted = entries.sort((a, b) => b[1] - a[1])

  return {
    best: { label: sorted[0][0], value: sorted[0][1] },
    worst: { label: sorted[sorted.length - 1][0], value: sorted[sorted.length - 1][1] },
  }
}

function getSportName(bet: { sportName?: string; sport?: string }): string {
  return bet.sportName || bet.sport || "Sem esporte"
}

function getAverageOdd(bets: { odd: number }[]): number | null {
  if (bets.length === 0) return null

  const totalOdds = bets.reduce((total, bet) => total + bet.odd, 0)
  return totalOdds / bets.length
}

function getHighestGreenOddBet(
  bets: { event: string; odd: number; stake: number; profit: number; status: string }[]
): HighestGreenOdd | null {
  const greenBets = bets.filter((bet) => bet.status === "GREEN")
  if (greenBets.length === 0) return null

  const highestGreenBet = greenBets.reduce((highest, bet) => (bet.odd > highest.odd ? bet : highest))
  return {
    event: highestGreenBet.event,
    odd: highestGreenBet.odd,
    stake: highestGreenBet.stake,
    profit: highestGreenBet.profit,
  }
}

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

  const monthlySummary = useMemo(() => {
    const allBets = bets || []
    const isAllPeriods = selectedPeriod === ALL_PERIODS
    const parsedMonth = isAllPeriods ? null : parseMonthValue(selectedPeriod)
    const monthStart = parsedMonth ? startOfMonth(parsedMonth) : null
    const monthEnd = parsedMonth ? endOfMonth(parsedMonth) : null

    const finishedBeforePeriod = isAllPeriods
      ? []
      : allBets.filter((bet) => {
          if (bet.status === "PENDING") return false

          const betDate = parseBetDate(bet.betDate)
          return Boolean(monthStart && betDate && betDate < monthStart)
        })

    const periodBets = isAllPeriods
      ? allBets
      : allBets.filter((bet) => {
          const betDate = parseBetDate(bet.betDate)
          return Boolean(monthStart && monthEnd && betDate && betDate >= monthStart && betDate <= monthEnd)
        })

    const finishedPeriodBets = periodBets.filter((bet) => bet.status !== "PENDING")
    const profitBeforePeriod = finishedBeforePeriod.reduce((total, bet) => total + bet.profit, 0)
    const periodProfit = finishedPeriodBets.reduce((total, bet) => total + bet.profit, 0)
    const totalInvested = finishedPeriodBets.reduce((total, bet) => total + bet.stake, 0)
    const initialBalance = (selectedBankroll?.initialBalance ?? 0) + profitBeforePeriod
    const finalBalance = initialBalance + periodProfit
    const roi = totalInvested > 0 ? (periodProfit / totalInvested) * 100 : 0
    const averagePeriodOdd = getAverageOdd(periodBets)
    const averageTotalOdd = getAverageOdd(allBets)
    const highestGreenOddBet = getHighestGreenOddBet(periodBets)
    const dailyProfitMap = new Map<string, number>()
    const sportProfitMap = new Map<string, number>()

    for (const bet of finishedPeriodBets) {
      const betDate = parseBetDate(bet.betDate)
      if (!betDate) continue

      const dayLabel = format(betDate, "dd/MM/yyyy")
      dailyProfitMap.set(dayLabel, (dailyProfitMap.get(dayLabel) || 0) + bet.profit)

      const sportName = getSportName(bet)
      sportProfitMap.set(sportName, (sportProfitMap.get(sportName) || 0) + bet.profit)
    }

    const dayHighlights = getBestAndWorst(dailyProfitMap)
    const sportResults: SportResult[] = Array.from(sportProfitMap.entries())
      .map(([sport, profit]) => ({ sport, profit }))
      .sort((a, b) => b.profit - a.profit)

    return {
      initialBalance,
      finalBalance,
      periodProfit,
      roi,
      totalInvested,
      totalBets: periodBets.length,
      finishedBets: finishedPeriodBets.length,
      averagePeriodOdd,
      averageTotalOdd,
      highestGreenOddBet,
      bestDay: dayHighlights.best,
      worstDay: dayHighlights.worst,
      sportResults,
    }
  }, [bets, selectedBankroll?.initialBalance, selectedPeriod])

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

        <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-[minmax(220px,280px)_minmax(320px,460px)] lg:w-auto">
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
          <Card className="rounded-3xl border-border bg-card p-6 text-card-foreground shadow-sm">
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

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
            <Card className="rounded-3xl border-border bg-card p-6 text-card-foreground shadow-sm">
              <h3 className="text-lg font-semibold text-foreground">Destaques por dia</h3>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <HighlightCard label="Melhor dia" highlight={monthlySummary.bestDay} positive />
                <HighlightCard label="Pior dia" highlight={monthlySummary.worstDay} />
              </div>
            </Card>
          </section>

          <section>
            <Card className="rounded-3xl border-border bg-card p-6 text-card-foreground shadow-sm">
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold text-foreground">Resultado por esporte</h3>
                <p className="text-sm text-muted-foreground">
                  Lucro ou prejuizo de cada esporte no periodo selecionado.
                </p>
              </div>

              {monthlySummary.sportResults.length > 0 ? (
                <div className="mt-5 overflow-hidden rounded-2xl border border-border">
                  {monthlySummary.sportResults.map((result) => (
                    <div
                      key={result.sport}
                      className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-border bg-card px-4 py-3 last:border-b-0"
                    >
                      <div>
                        <p className="text-sm font-semibold text-foreground">{result.sport}</p>
                        <p className="text-xs font-medium text-muted-foreground">
                          {formatUnits(result.profit)}
                        </p>
                      </div>
                      <p
                        className={[
                          "text-right text-sm font-bold",
                          result.profit >= 0
                            ? "text-emerald-600 dark:text-emerald-300"
                            : "text-red-600 dark:text-rose-300",
                        ].join(" ")}
                      >
                        {formatCurrency(result.profit)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-5 rounded-2xl border border-border bg-muted/35 p-4 text-sm text-muted-foreground">
                  Nenhum esporte com apostas finalizadas neste periodo.
                </p>
              )}
            </Card>
          </section>
        </>
      )}
    </div>
  )
}

function HighestGreenCard({ bet }: { bet: HighestGreenOdd | null }) {
  const returnAmount = bet ? bet.stake + bet.profit : null

  return (
    <Card className={`${METRIC_CARD_CLASS} rounded-2xl border border-border/80 bg-card/95 p-6 text-card-foreground shadow-[0_10px_24px_-14px_rgba(15,23,42,0.3),0_2px_5px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-16px_rgba(15,23,42,0.35),0_6px_10px_-8px_rgba(15,23,42,0.15)] dark:border-border/90 dark:bg-card/95 dark:shadow-[0_16px_36px_-22px_rgba(2,6,23,0.95),0_6px_14px_rgba(2,6,23,0.65)] dark:hover:shadow-[0_20px_42px_-22px_rgba(2,6,23,0.98),0_8px_18px_rgba(2,6,23,0.72)]`}>
      <div className="mb-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Maior green
        </p>
      </div>

      {bet ? (
        <div className="grid grid-cols-[auto_1fr] items-end gap-3">
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">
            {formatOdd(bet.odd)}
          </p>
          <div className="space-y-1.5 text-right text-xs">
            <p className="line-clamp-1 font-semibold text-foreground">{bet.event}</p>
            <div className="grid grid-cols-2 gap-2 leading-tight">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Apostado</p>
                <p className="mt-1 font-semibold text-foreground">{formatCurrency(bet.stake)}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Retorno</p>
                <p className="mt-1 font-semibold text-emerald-600 dark:text-emerald-300">
                  {formatCurrency(returnAmount ?? 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">
            {formatOdd(null)}
          </p>
          <p className="mt-3 text-right text-sm font-semibold text-muted-foreground">Sem green</p>
        </>
      )}
    </Card>
  )
}

function HighlightCard({
  label,
  highlight,
  positive = false,
}: {
  label: string
  highlight: Highlight | null
  positive?: boolean
}) {
  const valueClassName = positive
    ? "text-emerald-600 dark:text-emerald-300"
    : "text-red-600 dark:text-rose-300"

  return (
    <div className="rounded-2xl border border-border bg-muted/35 p-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      {highlight ? (
        <>
          <p className="mt-3 text-base font-semibold text-foreground">{highlight.label}</p>
          <p className={`mt-1 text-xl font-bold ${valueClassName}`}>
            {formatCurrency(highlight.value)}
          </p>
          <p className={`mt-1 text-sm font-semibold ${valueClassName}`}>
            {formatUnits(highlight.value)}
          </p>
        </>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">Sem apostas finalizadas</p>
      )}
    </div>
  )
}
