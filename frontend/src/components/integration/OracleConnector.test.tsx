import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import OracleConnector from './OracleConnector'

describe('OracleConnector', () => {
  it('renders oracle cloud integration component', () => {
    render(<OracleConnector />)
    
    expect(screen.getByText('Oracle Cloud Integration')).toBeInTheDocument()
    expect(screen.getByText('Connect')).toBeInTheDocument()
    expect(screen.getByText('Autonomous DB')).toBeInTheDocument()
    expect(screen.getByText('ORDS APIs')).toBeInTheDocument()
    expect(screen.getByText('OCI Functions')).toBeInTheDocument()
    expect(screen.getByText('Analytics Cloud')).toBeInTheDocument()
  })

  it('shows disconnected state initially', () => {
    render(<OracleConnector />)
    
    expect(screen.getAllByText('disconnected')).toHaveLength(4)
    expect(screen.getByText('Connect to view Autonomous Database metrics')).toBeInTheDocument()
  })

  it('handles connection process', async () => {
    render(<OracleConnector />)
    
    const connectButton = screen.getByText('Connect')
    fireEvent.click(connectButton)
    
    await waitFor(() => {
      expect(screen.getByText('connecting')).toBeInTheDocument()
    }, { timeout: 100 })
    
    await waitFor(() => {
      expect(screen.getByText('connected')).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('allows service selection', () => {
    render(<OracleConnector />)
    
    const ordsService = screen.getByText('ORDS APIs').closest('div')
    fireEvent.click(ordsService!)
    
    expect(screen.getByText('Oracle REST Data Services')).toBeInTheDocument()
  })
})