import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { render } from '../test-utils';
import Bankrolls from '../../pages/Bankrolls';
import type { Bankroll } from '../../types';
import * as api from '../../services/api';

describe('Bankrolls Page', () => {
  const mockBankrolls: Bankroll[] = [
    {
      id: 1,
      name: 'Banca Principal',
      initialBalance: 1000,
      currentBalance: 1250,
      createdAt: '01/01/2024',
    },
    {
      id: 2,
      name: 'Banca Secundária',
      initialBalance: 500,
      currentBalance: 450,
      createdAt: '15/01/2024',
    },
  ];

  beforeEach(() => {
    // Mock API calls
    vi.spyOn(api.bankrollAPI, 'getAll').mockResolvedValue({ data: mockBankrolls } as any);
  });

  it('should render bankrolls page', async () => {
    render(<Bankrolls />);
    
    await waitFor(() => {
      expect(screen.getByText('Bancas')).toBeInTheDocument();
    });
  });

  it('should display existing bankrolls', async () => {
    render(<Bankrolls />);
    
    await waitFor(() => {
      expect(screen.getByText('Banca Principal')).toBeInTheDocument();
      expect(screen.getByText('Banca Secundária')).toBeInTheDocument();
    });
  });

  it('should display bankroll balances', async () => {
    render(<Bankrolls />);
    
    await waitFor(() => {
      expect(screen.getByText('R$ 1250.00')).toBeInTheDocument();
      expect(screen.getByText('R$ 450.00')).toBeInTheDocument();
    });
  });

  it('should have "Nova Banca" button', async () => {
    render(<Bankrolls />);
    
    await waitFor(() => {
      const buttons = screen.getAllByText('Nova Banca');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  it('should display empty state when no bankrolls', async () => {
    vi.spyOn(api.bankrollAPI, 'getAll').mockResolvedValue({ data: [] } as any);
    
    render(<Bankrolls />);
    
    await waitFor(() => {
      expect(screen.getByText(/nenhuma banca cadastrada/i)).toBeInTheDocument();
    });
  });
});
