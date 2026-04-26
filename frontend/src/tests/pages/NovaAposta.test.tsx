import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { render } from '../test-utils'
import NovaAposta from '../../pages/NovaAposta'
import * as api from '../../services/api'

describe('NovaAposta page', () => {
  beforeEach(() => {
    vi.spyOn(api.bankrollAPI, 'getAll').mockResolvedValue({ data: [{ id: 1, name: 'Main Bankroll', initialBalance: 1000, currentBalance: 1000, createdAt: '01/01/2024' }] } as any)
    vi.spyOn(api.sportAPI, 'getAll').mockResolvedValue({ data: [] } as any)
    vi.spyOn(api.marketAPI, 'getAll').mockResolvedValue({ data: [] } as any)
    vi.spyOn(api.bookmakerAPI, 'getAll').mockResolvedValue({ data: [] } as any)
    vi.spyOn(api.tipsterAPI, 'getAll').mockResolvedValue({ data: [] } as any)
  })

  it('renders the new bet form page', async () => {
    render(<NovaAposta />)

    await waitFor(() => {
      expect(screen.getByText('Nova Aposta')).toBeInTheDocument()
      expect(screen.getByText('Cadastre uma nova aposta preenchendo os campos abaixo.')).toBeInTheDocument()
      expect(screen.getByText('Banca')).toBeInTheDocument()
      expect(screen.getByText('Data')).toBeInTheDocument()
      expect(screen.getByText('Evento')).toBeInTheDocument()
      expect(screen.getByText('Mercado')).toBeInTheDocument()
      expect(screen.getByText('Esporte')).toBeInTheDocument()
    })
  })
})
