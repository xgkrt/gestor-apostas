import { beforeEach, describe, expect, it, vi } from "vitest"
import { screen, waitFor } from "@testing-library/react"
import { render } from "../test-utils"
import Annual from "../../pages/Annual"
import type { Bankroll, Bet } from "../../types"
import * as api from "../../services/api"

describe("Annual", () => {
  const currentYear = new Date().getFullYear()

  const mockBankrolls: Bankroll[] = [
    {
      id: 1,
      name: "Principal",
      initialBalance: 1000,
      currentBalance: 1070,
      createdAt: "01/01/2024",
    },
  ]

  const mockBets: Bet[] = [
    {
      id: 1,
      bankrollId: 1,
      betDate: `${currentYear}-01-15`,
      event: "Green de janeiro",
      sport: "Futebol",
      odd: 2.2,
      stake: 100,
      status: "GREEN",
      profit: 120,
      createdAt: `15/01/${currentYear}`,
    },
    {
      id: 2,
      bankrollId: 1,
      betDate: `10/03/${currentYear}`,
      event: "Red de marco",
      sport: "Basquete",
      odd: 1.8,
      stake: 50,
      status: "RED",
      profit: -50,
      createdAt: `10/03/${currentYear}`,
    },
    {
      id: 3,
      bankrollId: 1,
      betDate: `20/03/${currentYear}`,
      event: "Pendente ignorada",
      sport: "Tenis",
      odd: 2,
      stake: 80,
      status: "PENDING",
      profit: 0,
      createdAt: `20/03/${currentYear}`,
    },
  ]

  beforeEach(() => {
    vi.spyOn(api.bankrollAPI, "getAll").mockResolvedValue({ data: mockBankrolls } as any)
    vi.spyOn(api.betAPI, "getByBankrollId").mockResolvedValue({ data: mockBets } as any)
  })

  it("shows the current year by default and summarizes monthly and annual profit", async () => {
    render(<Annual />)

    await waitFor(() => {
      expect(screen.getByText("Anual")).toBeInTheDocument()
      expect(screen.getByText(String(currentYear))).toBeInTheDocument()
      expect(screen.getByText("R$ 120,00")).toBeInTheDocument()
    })

    expect(screen.getByText("janeiro")).toBeInTheDocument()
    expect(screen.getByText((content) => content.toLowerCase().startsWith("mar"))).toBeInTheDocument()
    expect(screen.getByText("+2.40u")).toBeInTheDocument()
    expect(screen.getByText("-R$ 50,00")).toBeInTheDocument()
    expect(screen.getByText("-1.00u")).toBeInTheDocument()
    expect(screen.getAllByText("Sem movimento").length).toBeGreaterThan(0)
    expect(screen.getByText(`Total de ${currentYear}`)).toBeInTheDocument()
    expect(screen.getByText("2 apostas finalizadas")).toBeInTheDocument()
    expect(screen.getByText("R$ 70,00")).toBeInTheDocument()
    expect(screen.getByText("+1.40u")).toBeInTheDocument()
  })
})
