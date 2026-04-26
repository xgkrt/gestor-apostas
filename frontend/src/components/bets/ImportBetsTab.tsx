import { useMemo, useState } from "react"
import { useBankrolls, useCommitBetImport, usePreviewBetImport } from "@/services/queries"
import type { BetImportPreviewResponse } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

const formatCurrency = (value: number | null) => {
  if (value === null || Number.isNaN(value)) return "-"
  return brlFormatter.format(value)
}

export function ImportBetsTab() {
  const now = new Date()
  const [file, setFile] = useState<File | null>(null)
  const [bankrollId, setBankrollId] = useState<string>("")
  const [month, setMonth] = useState<string>(String(now.getMonth() + 1))
  const [year, setYear] = useState<string>(String(now.getFullYear()))
  const [preview, setPreview] = useState<BetImportPreviewResponse | null>(null)

  const { toast } = useToast()
  const { data: bankrolls } = useBankrolls()
  const previewImport = usePreviewBetImport()
  const commitImport = useCommitBetImport()

  const canPreview = useMemo(() => Boolean(file && bankrollId && month && year), [file, bankrollId, month, year])

  const handlePreview = async () => {
    if (!file || !bankrollId) return

    const formData = new FormData()
    formData.append("file", file)
    formData.append("bankrollId", bankrollId)
    formData.append("month", month)
    formData.append("year", year)

    try {
      const response = await previewImport.mutateAsync(formData)
      setPreview(response)
      toast({
        title: "Prévia gerada",
        description: `${response.validRows} linhas válidas e ${response.invalidRows} inválidas.`,
      })
    } catch (error) {
      console.error("Erro ao gerar prévia:", error)
      setPreview(null)
      toast({
        title: "Erro ao ler planilha",
        description: "Verifique o arquivo e tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleImport = async () => {
    if (!preview?.previewId) return

    try {
      const response = await commitImport.mutateAsync(preview.previewId)
      toast({
        title: "Importação concluída",
        description: `${response.importedRows} apostas importadas com sucesso.`,
        variant: "success",
      })
      setPreview(null)
      setFile(null)
    } catch (error) {
      console.error("Erro ao importar planilha:", error)
      toast({
        title: "Erro ao importar",
        description: "Não foi possível concluir a importação.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="import-file">Arquivo (.xlsx ou .csv)</Label>
          <Input
            id="import-file"
            type="file"
            accept=".xlsx,.csv"
            onChange={(event) => {
              setFile(event.target.files?.[0] ?? null)
              setPreview(null)
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="import-bankroll">Banca</Label>
          <Select value={bankrollId} onValueChange={setBankrollId}>
            <SelectTrigger id="import-bankroll">
              <SelectValue placeholder="Selecione a banca" />
            </SelectTrigger>
            <SelectContent>
              {bankrolls?.map((bankroll) => (
                <SelectItem key={bankroll.id} value={bankroll.id.toString()}>
                  {bankroll.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="import-month">Mês de referência</Label>
          <Input
            id="import-month"
            type="number"
            min="1"
            max="12"
            value={month}
            onChange={(event) => setMonth(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="import-year">Ano de referência</Label>
          <Input
            id="import-year"
            type="number"
            min="2000"
            max="2100"
            value={year}
            onChange={(event) => setYear(event.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="button" onClick={handlePreview} disabled={!canPreview || previewImport.isPending}>
          {previewImport.isPending ? "Processando..." : "Pré-visualizar"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleImport}
          disabled={!preview?.previewId || preview.validRows === 0 || commitImport.isPending}
        >
          {commitImport.isPending ? "Importando..." : "Importar válidas"}
        </Button>
      </div>

      {preview && (
        <div className="space-y-3 rounded-xl border border-border bg-card p-4 text-card-foreground">
          <p className="text-sm text-muted-foreground">
            Total: <strong>{preview.totalRows}</strong> | Válidas: <strong>{preview.validRows}</strong> | Inválidas: <strong>{preview.invalidRows}</strong>
          </p>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="p-2">Linha</th>
                  <th className="p-2">Data</th>
                  <th className="p-2">Evento</th>
                  <th className="p-2">Esporte</th>
                  <th className="p-2">Mercado</th>
                  <th className="p-2">Casa</th>
                  <th className="p-2">Tipster</th>
                  <th className="p-2">Odd</th>
                  <th className="p-2">Stake (R$)</th>
                  <th className="p-2">Resultado (R$)</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Resultado</th>
                </tr>
              </thead>
              <tbody>
                {preview.rows.map((row) => (
                  <tr key={row.rowNumber} className="border-b border-border/60 align-top">
                    <td className="p-2">{row.rowNumber}</td>
                    <td className="p-2">{row.betDate || "-"}</td>
                    <td className="p-2">{row.event || "-"}</td>
                    <td className="p-2">{row.sport || "-"}</td>
                    <td className="p-2">{row.market || "-"}</td>
                    <td className="p-2">{row.bookmaker || "-"}</td>
                    <td className="p-2">{row.tipster || "-"}</td>
                    <td className="p-2 impact-value">{row.odd ?? "-"}</td>
                    <td className="p-2 impact-money">{formatCurrency(row.stake)}</td>
                    <td className="p-2 impact-money">{formatCurrency(row.result)}</td>
                    <td className="p-2">{row.status}</td>
                    <td className="p-2">
                      {row.valid ? (
                        <span className="impact-status text-emerald-600 dark:text-emerald-300">Válida</span>
                      ) : (
                        <span className="impact-status text-red-600 dark:text-rose-300">Inválida</span>
                      )}
                      {row.warnings.length > 0 && (
                        <div className="mt-1 text-xs text-amber-600">{row.warnings.join(" | ")}</div>
                      )}
                      {row.errors.length > 0 && (
                        <div className="mt-1 text-xs text-red-600">{row.errors.join(" | ")}</div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
