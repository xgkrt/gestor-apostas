import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../test-utils';
import Dashboard from '../../pages/Dashboard';
import type { Bankroll, Dashboard as DashboardType, Bet } from '../../types';
import * as api from '../../services/api';

// Mock recharts to avoid rendering issues in tests
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  PieChart: ({ children }: { children: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
}));

// Mock lazy chart components
vi.mock('../../components/dashboard/LazyCharts', () => ({
  BankrollEvolutionChart: () => <div data-testid="line-chart">Evolution Chart</div>,
  ProfitByBookmaker: () => <div data-testid="pie-chart">Profit Chart</div>,
  ProfitByTipster: () => <div data-testid="tipster-chart">Tipster Profit Chart</div>,
}));

describe('Dashboard Integration Tests', () => {
  const mockBankrolls: Bankroll[] = [
    {
      id: 1,
      name: 'Main Bankroll',
      initialBalance: 1000,
      currentBalance: 1250,
      createdAt: '01/01/2024',
    },
  ];

  const mockDashboard: DashboardType = {
    initialBalance: 1000,
    currentBalance: 1250,
    totalProfit: 250,
    roi: 25.0,
    winRate: 75.0,
    totalBets: 1,
    greenBets: 1,
    redBets: 0,
    pendingBets: 0,
    totalInvested: 50,
    bankrollEvolution: [
      { date: '01/01/2024', balance: 1000 },
      { date: '20/03/2024', balance: 1250 },
    ],
    profitByBookmaker: [
      { bookmaker: 'Bet365', profit: 250 },
    ],
    profitByTipster: [
      { tipster: 'CASEBRE', profit: 250 },
    ],
  };

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
  ];

  beforeEach(() => {
    // Mock API calls
    vi.spyOn(api.bankrollAPI, 'getAll').mockResolvedValue({ data: mockBankrolls } as any);
    vi.spyOn(api.dashboardAPI, 'get').mockResolvedValue({ data: mockDashboard } as any);
    vi.spyOn(api.betAPI, 'getAll').mockResolvedValue({ data: mockBets } as any);
    vi.spyOn(api.betAPI, 'getByBankrollId').mockResolvedValue({ data: mockBets } as any);
  });

  it('renders dashboard page', async () => {
    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/visão geral da banca/i)).toBeInTheDocument();
    });
  });

  it('displays metrics', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      // Should show currency values (R$ for Reais)
      expect(screen.getByText(/R\$ 1250\.00/)).toBeInTheDocument();
      // ROI appears multiple times (in card and badge), so use getAllByText
      const roiElements = screen.getAllByText(/25\.0%/);
      expect(roiElements.length).toBeGreaterThan(0);
      expect(screen.getByText(/75%/)).toBeInTheDocument();
      expect(screen.getByText('+1.50u')).toBeInTheDocument();
    });
  });

  it('displays charts after suspense resolves', async () => {
    render(<Dashboard />);

    // Wait for charts to load (after Suspense)
    await waitFor(() => {
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
      expect(screen.getByTestId('tipster-chart')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('does not show bankroll selector on dashboard', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.queryByLabelText(/selecione uma banca/i)).not.toBeInTheDocument();
    });
  });

  it('shows calendar period control', async () => {
    const user = userEvent.setup();

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: 'Periodo' })).toBeInTheDocument();
      expect(screen.getAllByRole('button', { name: 'Mes anterior' }).length).toBeGreaterThan(0);
      expect(screen.getAllByRole('button', { name: 'Proximo mes' }).length).toBeGreaterThan(0);
    });

    expect(screen.queryByText('Ano')).not.toBeInTheDocument();

    await user.click(screen.getByRole('combobox', { name: 'Periodo' }));

    expect(await screen.findByRole('option', { name: 'Tudo' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Hoje' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Ultimos 7 dias' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Janeiro de 2026' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Dezembro de 2026' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Ultimos 15 dias' })).not.toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Este ano' })).not.toBeInTheDocument();
  });

  it('navigates to new bet page from dashboard button', async () => {
    const user = userEvent.setup();

    render(<Dashboard />);

    await user.click(await screen.findByRole('button', { name: /nova aposta/i }));

    expect(await screen.findByText('Nova Aposta')).toBeInTheDocument();
  });
});
