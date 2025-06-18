import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import DeltaShareExplorer from './DeltaShareExplorer'

describe('DeltaShareExplorer', () => {
  it('renders delta share protocol component', () => {
    render(<DeltaShareExplorer />)
    
    expect(screen.getByText('Delta Share Protocol')).toBeInTheDocument()
    expect(screen.getByText('Datasets')).toBeInTheDocument()
    expect(screen.getByText('Shares')).toBeInTheDocument()
    expect(screen.getByText('Governance')).toBeInTheDocument()
    expect(screen.getByText('Performance')).toBeInTheDocument()
  })

  it('shows provider mode initially', () => {
    render(<DeltaShareExplorer />)
    
    expect(screen.getByText('Provider')).toBeInTheDocument()
    expect(screen.getByText('Secure data sharing without data movement')).toBeInTheDocument()
  })

  it('allows switching between provider and recipient modes', () => {
    render(<DeltaShareExplorer />)
    
    const recipientButton = screen.getByText('Recipient')
    fireEvent.click(recipientButton)
    
    expect(screen.getByText('Recipient')).toBeInTheDocument()
  })

  it('has navigation tabs', () => {
    render(<DeltaShareExplorer />)
    
    expect(screen.getByText('Datasets')).toBeInTheDocument()
    expect(screen.getByText('Shares')).toBeInTheDocument()
    expect(screen.getByText('Governance')).toBeInTheDocument()
    expect(screen.getByText('Performance')).toBeInTheDocument()
    expect(screen.getByText('Security')).toBeInTheDocument()
    expect(screen.getByText('Onboarding')).toBeInTheDocument()
    expect(screen.getByText('Cost Calculator')).toBeInTheDocument()
  })

  it('shows sample mining datasets', () => {
    render(<DeltaShareExplorer />)
    
    expect(screen.getByText('Ore Grades 2024')).toBeInTheDocument()
    expect(screen.getByText('Equipment Telemetry')).toBeInTheDocument()
    expect(screen.getByText('Daily Production Reports')).toBeInTheDocument()
  })
})