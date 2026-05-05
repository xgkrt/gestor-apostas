import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../test-utils'
import Bets from '../../pages/Bets'
import type { Bankroll, Bet, Bookmaker, Market, Sport, Tipster } from '../../types'
import * as api from '../../services/api'

describe('Bets Integration Tests', () => {
  const mockBankrolls: Bankroll[] = [
    { id: 1, name: 'Principal', initialBalance: 1000, currentBalance: 1075, createdAt: '20/03/2024' },
    { id: 2, name: 'Secundaria', initialBalance: 500, currentBalance: 400, createdAt: '21/03/2024' },
  ]

  const mockSports: Sport[] = [
    { id: 1, name: 'Futebol', active: true },
    { id: 2, name: 'Basquete', active: true },
  ]

  const mockMarkets: Market[] = [
    { id: 1, name: 'Resultado Final', active: true },
    { id: 2, name: 'Total de Pontos', active: true },
  ]

  const mockBookmakers: Bookmaker[] = [
    { id: 1, name: 'Bet365', active: true },
    { id: 2, name: 'Betano', active: true },
  ]

  const mockTipsters: Tipster[] = [
    { id: 1, name: 'Tipster A', active: true },
    { id: 2, name: 'Tipster B', active: true },
  ]

  const mockBets: Bet[] = [
    {
      id: 1,
      bankrollId: 1,
      betDate: '20/03/2024',
      sportId: 1,
      marketId: 1,
      bookmakerId: 1,
      tipsterId: 1,
      sport: 'Futebol',
      event: 'Team A vs Team B',
      market: 'Resultado Final',
      bookmaker: 'Bet365',
      tipster: 'Tipster A',
      odd: 2.5,
      stake: 50,
      status: 'GREEN',
      profit: 75,
      createdAt: '20/03/2024',
    },
    {
      id: 2,
      bankrollId: 2,
      betDate: '21/03/2024',
      sportId: 2,
      marketId: 2,
      bookmakerId: 2,
      tipsterId: 2,
      sport: 'Basquete',
      event: 'Team C vs Team D',
      market: 'Total de Pontos',
      bookmaker: 'Betano',
      tipster: 'Tipster B',
      odd: 1.8,
      stake: 100,
      status: 'RED',
      profit: -100,
      createdAt: '21/03/2024',
    },
  ]

  beforeEach(() => {
    vi.spyOn(api.betAPI, 'getAll').mockResolvedValue({ data: mockBets } as any)
    vi.spyOn(api.bankrollAPI, 'getAll').mockResolvedValue({ data: mockBankrolls } as any)
    vi.spyOn(api.sportAPI, 'getAll').mockResolvedValue({ data: mockSports } as any)
    vi.spyOn(api.marketAPI, 'getAll').mockResolvedValue({ data: mockMarkets } as any)
    vi.spyOn(api.bookmakerAPI, 'getAll').mockResolvedValue({ data: mockBookmakers } as any)
    vi.spyOn(api.tipsterAPI, 'getAll').mockResolvedValue({ data: mockTipsters } as any)
  })

  const selectFilterOption = async (triggerName: string, optionName: string) => {
    const user = userEvent.setup()

    await user.click(screen.getByRole('combobox', { name: triggerName }))
    await user.click(await screen.findByRole('option', { name: optionName }))
  }

  it('renders bets page', async () => {
    render(<Bets />)

    await waitFor(() => {
      expect(screen.getByText('Minhas Apostas')).toBeInTheDocument()
    })
  })

  it('displays bet data', async () => {
    render(<Bets />)

    await waitFor(() => {
      expect(screen.getByText('Team A vs Team B')).toBeInTheDocument()
      expect(screen.getByText('Team C vs Team D')).toBeInTheDocument()
    })
  })

  it('displays result badges', async () => {
    render(<Bets />)

    await waitFor(() => {
      expect(screen.getByText('Green')).toBeInTheDocument()
      expect(screen.getByText('Red')).toBeInTheDocument()
    })
  })

  it('does not show new bet button', async () => {
    render(<Bets />)

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /nova aposta/i })).not.toBeInTheDocument()
    })
  })

  it('displays message when no bets exist', async () => {
    vi.spyOn(api.betAPI, 'getAll').mockResolvedValue({ data: [] } as any)

    render(<Bets />)

    await waitFor(() => {
      expect(screen.getByText(/nenhuma aposta cadastrada/i)).toBeInTheDocument()
    })
  })

  it('does not show bankroll filter', async () => {
    render(<Bets />)

    await waitFor(() => {
      expect(screen.getByText('Team A vs Team B')).toBeInTheDocument()
    })

    expect(screen.queryByRole('combobox', { name: 'Banca' })).not.toBeInTheDocument()
    expect(screen.queryByText('Todas as bancas')).not.toBeInTheDocument()
    expect(screen.getByText('Team A vs Team B')).toBeInTheDocument()
    expect(screen.getByText('Team C vs Team D')).toBeInTheDocument()
  })

  it('filters bets by sport', async () => {
    render(<Bets />)

    await waitFor(() => {
      expect(screen.getByText('Team A vs Team B')).toBeInTheDocument()
    })

    await selectFilterOption('Esporte', 'Basquete')

    expect(screen.queryByText('Team A vs Team B')).not.toBeInTheDocument()
    expect(screen.getByText('Team C vs Team D')).toBeInTheDocument()
  })

  it('filters bets by market', async () => {
    render(<Bets />)

    await waitFor(() => {
      expect(screen.getByText('Team A vs Team B')).toBeInTheDocument()
    })

    await selectFilterOption('Mercado', 'Total de Pontos')

    expect(screen.queryByText('Team A vs Team B')).not.toBeInTheDocument()
    expect(screen.getByText('Team C vs Team D')).toBeInTheDocument()
  })

  it('filters bets by bookmaker', async () => {
    render(<Bets />)

    await waitFor(() => {
      expect(screen.getByText('Team A vs Team B')).toBeInTheDocument()
    })

    await selectFilterOption('Casa', 'Betano')

    expect(screen.queryByText('Team A vs Team B')).not.toBeInTheDocument()
    expect(screen.getByText('Team C vs Team D')).toBeInTheDocument()
  })

  it('filters bets by tipster', async () => {
    render(<Bets />)

    await waitFor(() => {
      expect(screen.getByText('Team A vs Team B')).toBeInTheDocument()
    })

    await selectFilterOption('Tipster', 'Tipster B')

    expect(screen.queryByText('Team A vs Team B')).not.toBeInTheDocument()
    expect(screen.getByText('Team C vs Team D')).toBeInTheDocument()
  })
})
