import { useEffect, useState, type FormEvent } from "react"
import {
  useBankrolls,
  useBookmakers,
  useCreateBet,
  useMarkets,
  useSports,
  useTipsters,
} from "@/services/queries"
import type { BetDTO, BetStatus } from "@/types"
import { useToast } from "@/hooks/use-toast"

function getInitialFormData(bankrollId?: number): Partial<BetDTO> {
  const now = new Date()
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60 * 1000)

  return {
    bankrollId,
    betDate: localDate.toISOString().split("T")[0],
    status: "PENDING" as BetStatus,
  }
}

export function useNovaApostaPage() {
  const [formData, setFormData] = useState<Partial<BetDTO>>(getInitialFormData())

  const { toast } = useToast()
  const { data: bankrolls } = useBankrolls()
  const { data: sports } = useSports()
  const { data: markets } = useMarkets()
  const { data: bookmakers } = useBookmakers()
  const { data: tipsters } = useTipsters()
  const createBet = useCreateBet()

  useEffect(() => {
    if (!formData.bankrollId && bankrolls?.length) {
      setFormData((current) => ({ ...current, bankrollId: bankrolls[0].id }))
    }
  }, [bankrolls, formData.bankrollId])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    await createBet.mutateAsync(formData as BetDTO)
    toast({ title: "Aposta Criada com Sucesso!", variant: "success" })

    const defaultBankrollId = bankrolls?.[0]?.id
    setFormData(getInitialFormData(defaultBankrollId))
  }

  return {
    formData,
    setFormData,
    handleSubmit,
    bankrolls,
    sports,
    markets,
    bookmakers,
    tipsters,
    isSubmitting: createBet.isPending,
  }
}
