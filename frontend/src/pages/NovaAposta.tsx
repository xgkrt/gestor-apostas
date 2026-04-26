import { BetFormFields } from "@/components/bets/BetFormFields"
import { ImportBetsTab } from "@/components/bets/ImportBetsTab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNovaApostaPage } from "./NovaAposta/hooks/useNovaApostaPage"

export default function NovaAposta() {
  const {
    formData,
    setFormData,
    handleSubmit,
    bankrolls,
    sports,
    markets,
    bookmakers,
    tipsters,
    isSubmitting,
  } = useNovaApostaPage()

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Nova Aposta</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Cadastre uma nova aposta preenchendo os campos abaixo.
        </p>
      </div>

      <Tabs defaultValue="manual" className="space-y-6">
        <TabsList>
          <TabsTrigger value="manual">Aposta Manual</TabsTrigger>
          <TabsTrigger value="importar">Importar Planilha</TabsTrigger>
        </TabsList>

        <TabsContent value="manual">
          <div className="rounded-2xl border border-border bg-card p-8 text-card-foreground">
            <BetFormFields
              formData={formData}
              setFormData={setFormData}
              bankrolls={bankrolls}
              sports={sports}
              markets={markets}
              bookmakers={bookmakers}
              tipsters={tipsters}
              onSubmit={handleSubmit}
              submitLabel={isSubmitting ? "Salvando..." : "Adicionar Aposta"}
              isSubmitting={isSubmitting}
            />
          </div>
        </TabsContent>

        <TabsContent value="importar">
          <div className="rounded-2xl border border-border bg-card p-8 text-card-foreground">
            <ImportBetsTab />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
