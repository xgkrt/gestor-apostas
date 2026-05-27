import { BetFormFields } from "@/components/bets/BetFormFields"
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
    <div className="mx-auto w-full max-w-7xl space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">Nova Aposta</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Cadastre uma nova aposta preenchendo os campos abaixo.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 text-card-foreground sm:p-6 lg:p-8">
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
    </div>
  )
}
