import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { render } from '../test-utils'
import Bets from '../../pages/Bets'
import type { Bet } from '../../types'
import * as api from '../../services/api'

describe('Bets Integration Tests', () => {
  const mockBets: Bet[] = [
    {
      id: 1,
      bankrollId: 1,
      betDate: '20/03/2024',
      sport: 'Futebol',
      event: 'Team A vs Team B',
      market: 'Resultado Final',
      bookmaker: 'Bet365',
      odd: 2.5,
      stake: 50,
      status: 'GREEN',
      profit: 75,
      createdAt: '20/03/2024',
    },
    {
      id: 2,
      bankrollId: 1,
      betDate: '21/03/2024',
      sport: 'Futebol',
      event: 'Team C vs Team D',
      market: 'Resultado Final',
      bookmaker: 'Betano',
      odd: 1.8,
      stake: 100,
      status: 'RED',
      profit: -100,
      createdAt: '21/03/2024',
    },
  ]

  beforeEach(() => {
    vi.spyOn(api.betAPI, 'getAll').mockResolvedValue({ data: mockBets } as any)
  })

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
})
