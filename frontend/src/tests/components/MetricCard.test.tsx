import { describe, it, expect } from 'vitest'
import { render, screen } from '@/tests/test-utils'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { TrendingUp } from 'lucide-react'

describe('MetricCard', () => {
  it('should render label and value correctly', () => {
    render(
      <MetricCard 
        label="Saldo Atual" 
        value="R$ 1,000.00" 
      />
    )

    // Text renders as-is, CSS applies uppercase
    expect(screen.getByText('Saldo Atual')).toBeInTheDocument()
    expect(screen.getByText('R$ 1,000.00')).toBeInTheDocument()
  })

  it('should render icon when provided', () => {
    const { container } = render(
      <MetricCard 
        label="Lucro" 
        value="R$ 500.00" 
        icon={TrendingUp}
      />
    )

    // Icon renders as SVG element
    const icon = container.querySelector('svg')
    expect(icon).toBeInTheDocument()
  })

  it('should render trend with correct direction', () => {
    render(
      <MetricCard 
        label="ROI" 
        value="15.5%" 
        trend="+5.2%" 
        trendDirection="up"
      />
    )

    const trendElement = screen.getByText('+5.2%')
    expect(trendElement).toBeInTheDocument()
    expect(trendElement).toHaveClass('bg-emerald-50', 'text-emerald-700')
  })

  it('should render negative trend correctly', () => {
    render(
      <MetricCard 
        label="ROI" 
        value="-5.5%" 
        trend="-2.1%" 
        trendDirection="down"
      />
    )

    const trendElement = screen.getByText('-2.1%')
    expect(trendElement).toBeInTheDocument()
    expect(trendElement).toHaveClass('bg-red-50', 'text-red-700')
  })

  it('should not render trend when not provided', () => {
    render(
      <MetricCard 
        label="Win Rate" 
        value="65%" 
      />
    )

    expect(screen.queryByText(/\+/)).not.toBeInTheDocument()
    expect(screen.queryByText(/-/)).not.toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(
      <MetricCard 
        label="Test" 
        value="100" 
        className="custom-class"
      />
    )

    const card = container.querySelector('.custom-class')
    expect(card).toBeInTheDocument()
  })
})
