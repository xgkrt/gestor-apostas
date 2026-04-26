import { useEffect, useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface BookmakerProfitData {
  bookmaker: string
  profit: number
}

interface ProfitByBookmakerProps {
  data: BookmakerProfitData[]
  onViewReport?: () => void
}

interface ChartDatum {
  bookmaker: string
  shortBookmaker: string
  profit: number
  percentage: number
}

const PAGE_SIZE = 10

function formatCurrency(value: number) {
  return Math.trunc(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

function formatBarLabelValue(value: number) {
  if (value > 0) {
    return `+${formatCurrency(value)}`
  }

  return formatCurrency(value)
}

function renderBarLabel({ x, y, width, height, value }: any) {
  const xNum = typeof x === "string" ? Number(x) : x
  const yNum = typeof y === "string" ? Number(y) : y
  const widthNum = typeof width === "string" ? Number(width) : width
  const heightNum = typeof height === "string" ? Number(height) : height

  if (
    typeof xNum !== "number" ||
    typeof yNum !== "number" ||
    typeof widthNum !== "number" ||
    typeof heightNum !== "number" ||
    Number.isNaN(xNum) ||
    Number.isNaN(yNum) ||
    Number.isNaN(widthNum) ||
    Number.isNaN(heightNum)
  ) {
    return null
  }

  const numericValue = typeof value === "number" ? value : Number(value)
  if (Number.isNaN(numericValue)) {
    return null
  }

  const isPositive = numericValue >= 0
  const centerX = xNum + widthNum / 2
  const barTop = Math.min(yNum, yNum + heightNum)
  const barBottom = Math.max(yNum, yNum + heightNum)
  const labelY = isPositive ? barTop - 10 : barBottom + 16

  return (
    <text
      x={centerX}
      y={labelY}
      fill={isPositive ? "#15803d" : "#be123c"}
      textAnchor="middle"
      fontSize={12}
      fontWeight={900}
      stroke="var(--card)"
      strokeWidth={3}
      paintOrder="stroke"
      style={{ pointerEvents: "none" }}
    >
      {formatBarLabelValue(numericValue)}
    </text>
  )
}

function truncateLabel(value: string, max = 12) {
  if (value.length <= max) return value
  return `${value.slice(0, max)}...`
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: ChartDatum }>
}) {
  if (!active || !payload || payload.length === 0) return null

  const item = payload[0].payload as ChartDatum
  const isPositive = item.profit >= 0

  return (
    <div className="rounded-xl border border-border bg-popover px-3 py-2 shadow-xl">
      <p className="text-xs font-semibold text-popover-foreground">{item.bookmaker}</p>
      <p className={`mt-1 text-sm font-bold ${isPositive ? "text-emerald-700" : "text-rose-700"}`}>
        {formatCurrency(item.profit)}
      </p>
      <p className="text-xs text-muted-foreground">{item.percentage.toFixed(1)}% do total</p>
    </div>
  )
}

export function ProfitByBookmaker({ data }: ProfitByBookmakerProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE))

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE
    return data.slice(startIndex, startIndex + PAGE_SIZE)
  }, [data, currentPage])

  const totalAbsoluteProfit = useMemo(() => {
    return data.reduce((sum, item) => sum + Math.abs(item.profit), 0)
  }, [data])

  const chartData = useMemo<ChartDatum[]>(() => {
    return paginatedData.map((item) => {
      const percentage =
        totalAbsoluteProfit === 0 ? 0 : (Math.abs(item.profit) / totalAbsoluteProfit) * 100

      return {
        bookmaker: item.bookmaker,
        shortBookmaker: truncateLabel(item.bookmaker, 11),
        profit: item.profit,
        percentage,
      }
    })
  }, [paginatedData, totalAbsoluteProfit])

  const yDomain = useMemo<[number, number]>(() => {
    if (chartData.length === 0) return [-100, 100]

    const min = Math.min(...chartData.map((d) => d.profit), 0)
    const max = Math.max(...chartData.map((d) => d.profit), 0)
    const padding = Math.max((max - min) * 0.22, 70)

    return [min - padding, max + padding]
  }, [chartData])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
  }

  const startIndex = (currentPage - 1) * PAGE_SIZE
  const endIndex = Math.min(startIndex + PAGE_SIZE, data.length)

  return (
    <Card className="bg-card p-6 rounded-3xl border border-border shadow-sm flex flex-col h-full">
      <h4 className="text-lg font-semibold text-foreground mb-4">Lucro por Casa</h4>

      {data.length > 0 ? (
        <div className="flex flex-1 flex-col min-h-0">
          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 34, right: 8, left: 8, bottom: 58 }}
                barCategoryGap={18}
              >
                <defs>
                  <linearGradient id="profitPositiveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#15803d" />
                  </linearGradient>
                  <linearGradient id="profitNegativeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e11d48" />
                    <stop offset="100%" stopColor="#be123c" />
                  </linearGradient>
                </defs>

                <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
                <ReferenceLine y={0} stroke="var(--border)" />

                <XAxis
                  dataKey="shortBookmaker"
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  height={46}
                  tick={{
                    fontSize: 11,
                    fill: "var(--muted-foreground)",
                    fontWeight: 500,
                  }}
                />

                <YAxis
                  domain={yDomain}
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                  width={64}
                  tickFormatter={(value) =>
                    value.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                      maximumFractionDigits: 0,
                    })
                  }
                  tick={{
                    fontSize: 11,
                    fill: "var(--muted-foreground)",
                    fontWeight: 500,
                  }}
                />

                <Tooltip
                  cursor={{ fill: "var(--muted)", fillOpacity: 0.35 }}
                  content={<CustomTooltip />}
                />

                <Bar dataKey="profit" barSize={34} radius={10}>
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.bookmaker}
                      fill={entry.profit >= 0 ? "url(#profitPositiveGradient)" : "url(#profitNegativeGradient)"}
                    />
                  ))}
                  <LabelList dataKey="profit" content={renderBarLabel} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-auto pt-4 border-t flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Mostrando {startIndex + 1} a {endIndex} de {data.length} {data.length === 1 ? "casa" : "casas"}
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center text-muted-foreground">
          Nenhum dado disponível
        </div>
      )}
    </Card>
  )
}
