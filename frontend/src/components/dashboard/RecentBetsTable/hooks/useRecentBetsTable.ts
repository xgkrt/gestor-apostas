import { useEffect, useMemo, useState } from "react"
import { parse } from "date-fns"
import { useUpdateBetStatus, useDeleteBet } from "@/services/queries"
import { useDebounce } from "@/hooks/use-debounce"
import type { Bet } from "@/types"
import { PAGE_SIZE } from "../types"
import type { RecentBetsStatusFilter } from "../types"

export function useRecentBetsTable(bets: Bet[]) {
  const updateBetStatus = useUpdateBetStatus()
  const deleteBet = useDeleteBet()

  const [betToDelete, setBetToDelete] = useState<Bet | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<RecentBetsStatusFilter>("ALL")
  const [currentPage, setCurrentPage] = useState(1)

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
    return [...bets].sort((a, b) => {
      const createdDiff = parseCreatedAtTimestamp(b.createdAt) - parseCreatedAtTimestamp(a.createdAt)
      if (createdDiff !== 0) return createdDiff

      return b.id - a.id
    })
  }, [bets])

  const filteredBets = useMemo(() => {
    const normalizedTerm = debouncedSearchTerm.trim().toLowerCase()
    return sortedBets.filter((bet) => {
      const matchesSearch = !normalizedTerm || bet.event.toLowerCase().includes(normalizedTerm)
      if (!matchesSearch) return false

      if (statusFilter === "ALL") return true
      if (statusFilter === "GREEN") return bet.status === "GREEN" || bet.status === "HALF_GREEN"
      if (statusFilter === "RED") return bet.status === "RED" || bet.status === "HALF_RED"

      return bet.status === statusFilter
    })
  }, [sortedBets, debouncedSearchTerm, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredBets.length / PAGE_SIZE))

  const paginatedBets = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE
    return filteredBets.slice(startIndex, startIndex + PAGE_SIZE)
  }, [filteredBets, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const handleStatusChange = (betId: number, newStatus: string) => {
    updateBetStatus.mutate(
      { id: betId, status: newStatus },
      {
        onSuccess: () => {
          console.log("Status atualizado com sucesso!")
        },
        onError: (error) => {
          console.error("Erro ao atualizar status:", error)
          alert("Erro ao atualizar status. Tente novamente.")
        },
      }
    )
  }

  const openDeleteDialog = (bet: Bet) => {
    setBetToDelete(bet)
  }

  const closeDeleteDialog = () => {
    setBetToDelete(null)
  }

  const confirmDelete = () => {
    if (betToDelete) {
      deleteBet.mutate(betToDelete.id, {
        onSuccess: () => {
          console.log("Aposta excluida com sucesso!")
          closeDeleteDialog()
        },
        onError: (error) => {
          console.error("Erro ao excluir aposta:", error)
          alert("Erro ao excluir aposta. Tente novamente.")
        },
      })
    }
  }

  return {
    state: {
      betToDelete,
      searchTerm,
      statusFilter,
      currentPage,
      filteredBets,
      paginatedBets,
      totalPages,
    },
    handlers: {
      setSearchTerm,
      setStatusFilter,
      setCurrentPage,
      handleStatusChange,
      openDeleteDialog,
      closeDeleteDialog,
      confirmDelete,
    },
    isUpdatingStatus: updateBetStatus.isPending,
    isDeletingBet: deleteBet.isPending,
  }
}
