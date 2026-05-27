import { useMemo } from "react"
import { Card } from "@/components/ui/card"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts"

interface BankrollEvolutionData {
  date: string
  balance: number
}

interface BankrollEvolutionChartProps {
  data: BankrollEvolutionData[]
}

interface ChartDatum {
  date: string
  value: number
  profit: number
}

interface ChartBuildResult {
  series: ChartDatum[]
  baseBalance: number
}

function parseApiDate(date: string) {
  const [year, month, day] = date.split("-").map(Number)
  return new Date(year, month - 1, day)
}

function toApiDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function buildDailyChartData(data: BankrollEvolutionData[]): ChartBuildResult {
  if (data.length === 0) return { series: [], baseBalance: 0 }

  const sortedData = [...data].sort((a, b) => a.date.localeCompare(b.date))
  const balanceByDate = new Map<string, number>()
  const baseBalance = sortedData[0].balance

  sortedData.forEach((item) => {
    balanceByDate.set(item.date, item.balance)
  })

  const orderedDates = Array.from(balanceByDate.keys()).sort((a, b) => a.localeCompare(b))
  const firstDate = parseApiDate(orderedDates[0])
  const lastDate = parseApiDate(orderedDates[orderedDates.length - 1])

  const cursor = new Date(firstDate)
  let runningBalance = balanceByDate.get(orderedDates[0]) ?? 0
  const dailySeries: Array<{ date: string; value: number }> = []

  while (cursor <= lastDate) {
    const dateKey = toApiDate(cursor)
    const currentBalance = balanceByDate.get(dateKey)

    if (currentBalance !== undefined) {
      runningBalance = currentBalance
    }

    dailySeries.push({
      date: dateKey,
      value: runningBalance,
    })

    cursor.setDate(cursor.getDate() + 1)
  }

  const series = dailySeries.map((item) => ({
    date: item.date,
    value: item.value,
    profit: item.value - baseBalance,
  }))

  return { series, baseBalance }
}

function formatChartDate(date: string) {
  const [year, month, day] = date.split("-").map(Number)
  const parsedDate = new Date(year, month - 1, day)
  return parsedDate.toLocaleDateString("pt-BR")
}

function formatCurrency(value: number) {
  const sign = value > 0 ? "+" : ""
  return `R$ ${sign}${value.toFixed(2)}`
}

function formatAxisProfit(value: number) {
  const integerValue = Math.trunc(value)
  const sign = integerValue > 0 ? "+" : ""
  return `R$ ${sign}${integerValue.toLocaleString("pt-BR")}`
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: ChartDatum }>
}) {
  if (!active || !payload || payload.length === 0) return null

  const item = payload[0].payload
  const isPositive = item.profit >= 0
  const valueClassName = isPositive
    ? "text-emerald-700 bg-emerald-50"
    : "text-rose-700 bg-rose-50"

  return (
    <div className="rounded-xl border border-border bg-popover px-3 py-2 shadow-xl">
      <p className="text-xs font-semibold text-popover-foreground">
        {formatChartDate(item.date)}
      </p>
      <p className={`mt-1 inline-flex rounded-md px-2 py-0.5 text-sm font-bold ${valueClassName}`}>
        {formatCurrency(item.profit)}
      </p>
      <p className="text-xs text-muted-foreground">Lucro</p>
    </div>
  )
}

export function BankrollEvolutionChart({ data }: BankrollEvolutionChartProps) {
  const { series: chartData, baseBalance } = useMemo(() => buildDailyChartData(data), [data])

  return (
    <Card className="bg-card text-card-foreground p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-border shadow-sm">
      <div className="flex items-center justify-between mb-5 sm:mb-8">
        <h4 className="text-base font-semibold text-foreground sm:text-lg">
          Evolução da Banca
        </h4>
      </div>
      
      <div className="h-[240px] w-full sm:h-64">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="date" hide />
              <YAxis
                width={88}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontWeight: 600 }}
                tickFormatter={(value) => formatAxisProfit((value as number) - baseBalance)}
                domain={['dataMin - 100', 'dataMax + 100']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="natural" 
                dataKey="value" 
                stroke="#7c3aed" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Nenhum dado disponível
          </div>
        )}
      </div>
    </Card>
  )
}
