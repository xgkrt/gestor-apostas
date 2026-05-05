import { beforeEach, describe, expect, it, vi } from "vitest"
import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { render } from "../test-utils"
import MonthlyClosing from "../../pages/MonthlyClosing"
import type { Bankroll, Bet } from "../../types"
import * as api from "../../services/api"

describe("MonthlyClosing", () => {
  const mockBankrolls: Bankroll[] = [
    {
      id: 1,
      name: "Principal",
      initialBalance: 1000,
      currentBalance: 1260,
      createdAt: "01/01/2024",
    },
  ]

  const mockBets: Bet[] = [
    {
      id: 1,
      bankrollId: 1,
      betDate: "25/02/2024",
      event: "Aposta anterior",
      sport: "Tenis",
      odd: 2,
      stake: 100,
      status: "GREEN",
      profit: 100,
      createdAt: "25/02/2024",
    },
    {
      id: 2,
      bankrollId: 1,
      betDate: "05/03/2024",
      event: "Melhor aposta",
      sport: "Futebol",
      odd: 2.5,
      stake: 100,
      status: "GREEN",
      profit: 150,
      tipster: "Tipster A",
      createdAt: "05/03/2024",
    },
    {
      id: 3,
      bankrollId: 1,
      betDate: "10/03/2024",
      event: "Pior aposta",
      sport: "Basquete",
      odd: 1.8,
      stake: 80,
      status: "RED",
      profit: -80,
      tipster: "Tipster B",
      createdAt: "10/03/2024",
    },
    {
      id: 4,
      bankrollId: 1,
      betDate: "12/03/2024",
      event: "Aposta pendente",
      sport: "Volei",
      odd: 1.9,
      stake: 50,
      status: "PENDING",
      profit: 0,
      tipster: "Tipster C",
      createdAt: "12/03/2024",
    },
  ]

  beforeEach(() => {
    vi.spyOn(api.bankrollAPI, "getAll").mockResolvedValue({ data: mockBankrolls } as any)
    vi.spyOn(api.betAPI, "getByBankrollId").mockResolvedValue({ data: mockBets } as any)
  })

  async function selectPeriod(optionName: string) {
    const user = userEvent.setup()

    await waitFor(() => {
      expect(screen.getByText("Fechamento de Mes")).toBeInTheDocument()
    })

    await user.click(await screen.findByRole("combobox", { name: "Periodo" }))
    await user.click(await screen.findByRole("option", { name: optionName }))
  }

  it("selects any available month directly and calculates metrics in currency and units", async () => {
    render(<MonthlyClosing />)

    await selectPeriod("março de 2024")

    expect(screen.getAllByText("março de 2024").length).toBeGreaterThan(0)
    expect(screen.getByText("R$ 1.100,00")).toBeInTheDocument()
    expect(screen.getByText("+22.00u")).toBeInTheDocument()
    expect(screen.getByText("R$ 1.170,00")).toBeInTheDocument()
    expect(screen.getByText("+23.40u")).toBeInTheDocument()
    expect(screen.getByText("R$ 70,00")).toBeInTheDocument()
    expect(screen.getByText("+1.40u")).toBeInTheDocument()
    expect(screen.getByText("38,89%")).toBeInTheDocument()
    expect(screen.getByText("R$ 180,00")).toBeInTheDocument()
    expect(screen.getByText("+3.60u")).toBeInTheDocument()
    expect(screen.getByText("3")).toBeInTheDocument()
    expect(screen.getByText("2 finalizadas")).toBeInTheDocument()
    expect(screen.getByText("Media das odds")).toBeInTheDocument()
    expect(screen.getByText("2,07")).toBeInTheDocument()
    expect(screen.getByText("Total 2,05")).toBeInTheDocument()
    expect(screen.getByText("Maior green")).toBeInTheDocument()
    expect(screen.getByText("2,50")).toBeInTheDocument()
    expect(screen.getByText("Melhor aposta")).toBeInTheDocument()
    expect(screen.getByText("Apostado")).toBeInTheDocument()
    expect(screen.getByText("Retorno")).toBeInTheDocument()
    expect(screen.getAllByText("R$ 100,00").length).toBeGreaterThan(0)
    expect(screen.getByText("R$ 250,00")).toBeInTheDocument()
  })

  it("supports all periods option", async () => {
    render(<MonthlyClosing />)

    await selectPeriod("Todos os meses")

    expect(screen.getAllByText("Todos os meses").length).toBeGreaterThan(0)
    expect(screen.getByText("R$ 1.000,00")).toBeInTheDocument()
    expect(screen.getByText("+20.00u")).toBeInTheDocument()
    expect(screen.getByText("R$ 1.170,00")).toBeInTheDocument()
    expect(screen.getByText("+23.40u")).toBeInTheDocument()
    expect(screen.getByText("R$ 170,00")).toBeInTheDocument()
    expect(screen.getByText("+3.40u")).toBeInTheDocument()
    expect(screen.getByText("60,71%")).toBeInTheDocument()
    expect(screen.getByText("R$ 280,00")).toBeInTheDocument()
    expect(screen.getByText("+5.60u")).toBeInTheDocument()
    expect(screen.getByText("4")).toBeInTheDocument()
    expect(screen.getByText("3 finalizadas")).toBeInTheDocument()
    expect(screen.getByText("2,05")).toBeInTheDocument()
    expect(screen.getByText("Total 2,05")).toBeInTheDocument()
    expect(screen.getByText("2,50")).toBeInTheDocument()
    expect(screen.getByText("Melhor aposta")).toBeInTheDocument()
    expect(screen.getByText("R$ 250,00")).toBeInTheDocument()
  })

  it("keeps day highlights and removes notes and tipster sections", async () => {
    render(<MonthlyClosing />)

    await selectPeriod("março de 2024")

    expect(screen.getByText("Destaques por dia")).toBeInTheDocument()
    expect(screen.getByText("05/03/2024")).toBeInTheDocument()
    expect(screen.getByText("10/03/2024")).toBeInTheDocument()
    expect(screen.getAllByText("R$ 150,00").length).toBeGreaterThan(0)
    expect(screen.getAllByText("+3.00u").length).toBeGreaterThan(0)
    expect(screen.getAllByText("-R$ 80,00").length).toBeGreaterThan(0)
    expect(screen.getAllByText("-1.60u").length).toBeGreaterThan(0)
    expect(screen.queryByText("Destaques por tipster")).not.toBeInTheDocument()
    expect(screen.queryByText("Observacoes do mes")).not.toBeInTheDocument()
  })

  it("shows profit and loss by sport only for sports with finished movement", async () => {
    render(<MonthlyClosing />)

    await selectPeriod("Todos os meses")

    expect(screen.getByText("Resultado por esporte")).toBeInTheDocument()
    expect(screen.getByText("Futebol")).toBeInTheDocument()
    expect(screen.getByText("Basquete")).toBeInTheDocument()
    expect(screen.getByText("Tenis")).toBeInTheDocument()
    expect(screen.getAllByText("R$ 150,00").length).toBeGreaterThan(0)
    expect(screen.getAllByText("+3.00u").length).toBeGreaterThan(0)
    expect(screen.getAllByText("-R$ 80,00").length).toBeGreaterThan(0)
    expect(screen.getAllByText("-1.60u").length).toBeGreaterThan(0)
    expect(screen.queryByText("Volei")).not.toBeInTheDocument()
  })

  it("shows fallback for highest green odd when the period has no green bets", async () => {
    vi.spyOn(api.betAPI, "getByBankrollId").mockResolvedValue({
      data: [
        {
          id: 5,
          bankrollId: 1,
          betDate: new Date().toLocaleDateString("pt-BR"),
          event: "Aposta red",
          sport: "Futebol",
          odd: 3.1,
          stake: 100,
          status: "RED",
          profit: -100,
          createdAt: "03/03/2024",
        },
      ],
    } as any)

    render(<MonthlyClosing />)

    expect(await screen.findByText("Media das odds")).toBeInTheDocument()
    expect(screen.getByText("3,10")).toBeInTheDocument()
    expect(screen.getByText("Total 3,10")).toBeInTheDocument()
    expect(screen.getByText("Maior green")).toBeInTheDocument()
    expect(screen.getByText("--")).toBeInTheDocument()
    expect(screen.getByText("Sem green")).toBeInTheDocument()
  })
})
