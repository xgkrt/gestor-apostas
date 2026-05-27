import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/tests/test-utils'
import userEvent from '@testing-library/user-event'
import { ConfirmDialog } from '@/components/ConfirmDialog'

describe('ConfirmDialog', () => {
  const mockOnConfirm = vi.fn()
  const mockOnOpenChange = vi.fn()

  const defaultProps = {
    open: true,
    onOpenChange: mockOnOpenChange,
    title: 'Confirmar Ação',
    description: 'Você tem certeza que deseja prosseguir?',
    onConfirm: mockOnConfirm,
  }

  it('should render title and description when open', () => {
    render(<ConfirmDialog {...defaultProps} />)

    expect(screen.getByText('Confirmar Ação')).toBeInTheDocument()
    expect(screen.getByText('Você tem certeza que deseja prosseguir?')).toBeInTheDocument()
  })

  it('should not render when closed', () => {
    render(<ConfirmDialog {...defaultProps} open={false} />)

    expect(screen.queryByText('Confirmar Ação')).not.toBeInTheDocument()
  })

  it('should call onConfirm and close dialog when confirm button is clicked', async () => {
    const user = userEvent.setup()
    render(<ConfirmDialog {...defaultProps} />)

    const confirmButton = screen.getByText('Confirmar')
    await user.click(confirmButton)

    expect(mockOnConfirm).toHaveBeenCalledTimes(1)
    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })

  it('should close dialog when cancel button is clicked', async () => {
    const user = userEvent.setup()
    render(<ConfirmDialog {...defaultProps} />)

    const cancelButton = screen.getByText('Cancelar')
    await user.click(cancelButton)

    // Should call onOpenChange to close dialog
    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })

  it('should render custom button text', () => {
    render(
      <ConfirmDialog 
        {...defaultProps} 
        confirmText="Sim, excluir"
        cancelText="Não, manter"
      />
    )

    expect(screen.getByText('Sim, excluir')).toBeInTheDocument()
    expect(screen.getByText('Não, manter')).toBeInTheDocument()
  })

  it('should render destructive variant with warning icon', () => {
    render(<ConfirmDialog {...defaultProps} variant="destructive" />)

    const icon = document.body.querySelector('svg')
    expect(icon).toBeInTheDocument()
  })

  it('should apply destructive styling to confirm button', () => {
    render(<ConfirmDialog {...defaultProps} variant="destructive" />)

    const confirmButton = screen.getByText('Confirmar')
    expect(confirmButton).toHaveClass('bg-red-600')
  })

  it('should render ReactNode as description', () => {
    const customDescription = (
      <div>
        <p>Primeira linha</p>
        <p>Segunda linha</p>
      </div>
    )

    render(
      <ConfirmDialog 
        {...defaultProps} 
        description={customDescription}
      />
    )

    expect(screen.getByText('Primeira linha')).toBeInTheDocument()
    expect(screen.getByText('Segunda linha')).toBeInTheDocument()
  })
})
