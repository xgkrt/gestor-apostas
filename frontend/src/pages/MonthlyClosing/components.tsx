import { Card } from "@/components/ui/card"

import type { Highlight, HighestGreenOdd, SportResult } from "./types"
import { formatCurrency, formatOdd, formatUnits, METRIC_CARD_CLASS } from "./utils"

function HighestGreenCard({ bet }: { bet: HighestGreenOdd | null }) {
  const returnAmount = bet ? bet.stake + bet.profit : null

  return (
    <Card className={`${METRIC_CARD_CLASS} rounded-2xl border border-border/80 bg-card/95 p-4 text-card-foreground shadow-[0_10px_24px_-14px_rgba(15,23,42,0.3),0_2px_5px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-16px_rgba(15,23,42,0.35),0_6px_10px_-8px_rgba(15,23,42,0.15)] sm:p-6 dark:border-border/90 dark:bg-card/95 dark:shadow-[0_16px_36px_-22px_rgba(2,6,23,0.95),0_6px_14px_rgba(2,6,23,0.65)] dark:hover:shadow-[0_20px_42px_-22px_rgba(2,6,23,0.98),0_8px_18px_rgba(2,6,23,0.72)]`}>
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

function DayHighlightsCard({
  bestDay,
  worstDay,
}: {
  bestDay: Highlight | null
  worstDay: Highlight | null
}) {
  return (
    <Card className="rounded-2xl border-border bg-card p-4 text-card-foreground shadow-sm sm:rounded-3xl sm:p-6">
      <h3 className="text-lg font-semibold text-foreground">Destaques por dia</h3>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <HighlightCard label="Melhor dia" highlight={bestDay} positive />
        <HighlightCard label="Pior dia" highlight={worstDay} />
      </div>
    </Card>
  )
}

function SportResultsCard({ sportResults }: { sportResults: SportResult[] }) {
  return (
    <Card className="rounded-2xl border-border bg-card p-4 text-card-foreground shadow-sm sm:rounded-3xl sm:p-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-foreground">Resultado por esporte</h3>
        <p className="text-sm text-muted-foreground">
          Lucro ou prejuizo de cada esporte no periodo selecionado.
        </p>
      </div>

      {sportResults.length > 0 ? (
        <div className="mt-5 overflow-hidden rounded-2xl border border-border">
          {sportResults.map((result) => (
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
  )
}

export { DayHighlightsCard, HighestGreenCard, SportResultsCard }
