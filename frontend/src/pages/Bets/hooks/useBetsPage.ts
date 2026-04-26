import { useEffect, useMemo, useState, type FormEvent } from "react"
import { parse, startOfDay } from "date-fns"
import {
  useBets,
  useDeleteBet,
  useUpdateBet,
  useUpdateBetStatus,
} from "@/services/queries"
import type { Bet, BetDTO, BetStatus } from "@/types"
import { useDebounce } from "@/hooks/use-debounce"
import { useToast } from "@/hooks/use-toast"
import { PAGE_SIZE } from "../types"
import type { BetsPageState, BetsPageHandlers } from "../types"
import type { BetsStatusFilter } from "../types"

/**
 * Hook personalizado para gerenciar o estado e lógica da página de apostas
 */
export function useBetsPage() {
  // Estados do dialog de edição
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [betToEdit, setBetToEdit] = useState<Bet | null>(null)
  const [editFormData, setEditFormData] = useState<Partial<BetDTO>>({})

  // Estados de deleção
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [betToDelete, setBetToDelete] = useState<number | null>(null)

  // Estados de filtros e paginação
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<BetsStatusFilter>("ALL")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  // Hooks de dados e mutações
  const { toast } = useToast()
  const { data: bets, isLoading: loadingBets } = useBets()
  const deleteBet = useDeleteBet()
  const updateBet = useUpdateBet()
  const updateBetStatus = useUpdateBetStatus()
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const parseCreatedAtTimestamp = (createdAt?: string) => {
    if (!createdAt) return 0

    const brDateTime = parse(createdAt, "dd/MM/yyyy HH:mm", new Date())
    if (!Number.isNaN(brDateTime.getTime())) {
      return brDateTime.getTime()
    }

    const brDateTimeWithSeconds = parse(createdAt, "dd/MM/yyyy HH:mm:ss", new Date())
    if (!Number.isNaN(brDateTimeWithSeconds.getTime())) {
      return brDateTimeWithSeconds.getTime()
    }

    const brDate = parse(createdAt, "dd/MM/yyyy", new Date())
    if (!Number.isNaN(brDate.getTime())) {
      return brDate.getTime()
    }

    if (/^\d{4}-\d{2}-\d{2}/.test(createdAt)) {
      const isoDate = new Date(createdAt)
      if (!Number.isNaN(isoDate.getTime())) {
        return isoDate.getTime()
      }
    }

    return 0
  }

  const sortedBets = useMemo(() => {
    if (!bets) return []

    return [...bets].sort((a, b) => {
      const createdDiff = parseCreatedAtTimestamp(b.createdAt) - parseCreatedAtTimestamp(a.createdAt)
      if (createdDiff !== 0) return createdDiff

      return b.id - a.id
    })
  }, [bets])

  const parseBetDateTimestamp = (betDate: string) => {
    const brDate = parse(betDate, "dd/MM/yyyy", new Date())
    if (!Number.isNaN(brDate.getTime())) {
      return startOfDay(brDate).getTime()
    }

    const fallback = new Date(betDate)
    if (!Number.isNaN(fallback.getTime())) {
      return startOfDay(fallback).getTime()
    }

    return null
  }

  // Filtragem de apostas por termo de busca
  const filteredBets = useMemo(() => {
    const normalizedTerm = debouncedSearchTerm.trim().toLowerCase()

    const startDateTimestamp = startDate
      ? startOfDay(parse(startDate, "yyyy-MM-dd", new Date())).getTime()
      : null
    const endDateTimestamp = endDate
      ? startOfDay(parse(endDate, "yyyy-MM-dd", new Date())).getTime()
      : null

    return sortedBets.filter((bet) => {
      const matchesSearch = !normalizedTerm || bet.event.toLowerCase().includes(normalizedTerm)
      if (!matchesSearch) return false

      if (statusFilter !== "ALL") {
        if (statusFilter === "GREEN" && bet.status !== "GREEN" && bet.status !== "HALF_GREEN") {
          return false
        }

        if (statusFilter === "RED" && bet.status !== "RED" && bet.status !== "HALF_RED") {
          return false
        }

        if (statusFilter !== "GREEN" && statusFilter !== "RED" && bet.status !== statusFilter) {
          return false
        }
      }

      if (!startDateTimestamp && !endDateTimestamp) return true

      const betDateTimestamp = parseBetDateTimestamp(bet.betDate)
      if (betDateTimestamp === null) return false

      if (startDateTimestamp && betDateTimestamp < startDateTimestamp) return false
      if (endDateTimestamp && betDateTimestamp > endDateTimestamp) return false

      return true
    })
  }, [sortedBets, debouncedSearchTerm, statusFilter, startDate, endDate])

  // Cálculo de paginação
  const totalPages = Math.max(1, Math.ceil(filteredBets.length / PAGE_SIZE))

  const paginatedBets = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE
    return filteredBets.slice(startIndex, startIndex + PAGE_SIZE)
  }, [filteredBets, currentPage])

  // Resetar página ao mudar termo de busca
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, startDate, endDate])

  // Ajustar página se exceder total de páginas
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  // Handler para abrir dialog de deleção
  const handleDeleteClick = (id: number) => {
    setBetToDelete(id)
    setDeleteConfirmOpen(true)
  }

  // Handler para confirmar deleção
  const handleConfirmDelete = async () => {
    if (!betToDelete) return

    try {
      await deleteBet.mutateAsync(betToDelete)
      setBetToDelete(null)
    } catch (error) {
      console.error("Erro ao excluir aposta:", error)
    }
  }

  // Handler para abrir dialog de edição
  const handleEditClick = (bet: Bet) => {
    setBetToEdit(bet)
    setEditFormData({
      bankrollId: bet.bankrollId,
      sportId: bet.sportId,
      marketId: bet.marketId,
      bookmakerId: bet.bookmakerId,
      tipsterId: bet.tipsterId,
      sport: bet.sport,
      market: bet.market,
      bookmaker: bet.bookmaker,
      tipster: bet.tipster,
      event: bet.event,
      odd: bet.odd,
      stake: bet.stake,
      status: bet.status,
    })
    setEditDialogOpen(true)
  }

  // Handler para controlar abertura/fechamento do dialog de edição
  const handleEditDialogChange = (open: boolean) => {
    setEditDialogOpen(open)
    if (!open) {
      setBetToEdit(null)
      setEditFormData({})
    }
  }

  // Handler para salvar edição
  const handleSaveEdit = async (event: FormEvent) => {
    event.preventDefault()

    if (!betToEdit) return

    const eventName = editFormData.event?.trim()
    if (!eventName || !editFormData.bankrollId || !editFormData.status || !editFormData.odd || !editFormData.stake) {
      toast({
        title: "Preencha os campos obrigatorios",
        description: "Evento, banca, odd, stake e status sao obrigatorios.",
        variant: "destructive",
      })
      return
    }

    try {
      await updateBet.mutateAsync({
        id: betToEdit.id,
        data: {
          bankrollId: editFormData.bankrollId,
          betDate: betToEdit.betDate,
          sportId: editFormData.sportId,
          marketId: editFormData.marketId,
          bookmakerId: editFormData.bookmakerId,
          tipsterId: editFormData.tipsterId,
          sport: editFormData.sport,
          market: editFormData.market,
          bookmaker: editFormData.bookmaker,
          tipster: editFormData.tipster,
          event: eventName,
          odd: editFormData.odd,
          stake: editFormData.stake,
          status: editFormData.status,
        },
      })

      toast({ title: "Aposta atualizada com sucesso", variant: "success" })
      handleEditDialogChange(false)
    } catch (error) {
      console.error("Erro ao atualizar aposta:", error)
      toast({
        title: "Erro ao atualizar aposta",
        description: "Tente novamente em instantes.",
        variant: "destructive",
      })
    }
  }

  // Handler para mudança de status
  const handleStatusChange = (betId: number, status: BetStatus) => {
    updateBetStatus.mutate(
      { id: betId, status },
      {
        onError: (error) => {
          console.error("Erro ao atualizar status:", error)
          toast({
            title: "Erro ao atualizar status",
            description: "Tente novamente em instantes.",
            variant: "destructive",
          })
        },
      }
    )
  }

  // Estado retornado
  const state: BetsPageState = {
    editDialogOpen,
    betToEdit,
    editFormData,
    deleteConfirmOpen,
    betToDelete,
    searchTerm,
    statusFilter,
    startDate,
    endDate,
    currentPage,
    filteredBets,
    paginatedBets,
    totalPages,
  }

  // Handlers retornados
  const handlers: BetsPageHandlers = {
    handleEditClick,
    handleEditDialogChange,
    handleSaveEdit,
    setEditFormData,
    handleDeleteClick,
    handleConfirmDelete,
    setDeleteConfirmOpen,
    handleStatusChange,
    setSearchTerm,
    setStatusFilter,
    setStartDate,
    setEndDate,
    setCurrentPage,
  }

  return {
    state,
    handlers,
    isLoading: loadingBets,
    bets,
    isUpdatingBet: updateBet.isPending,
    isUpdatingStatus: updateBetStatus.isPending,
  }
}
