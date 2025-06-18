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

  it('has navigation tabs', () => {
    render(<OracleConnector />)
    
    expect(screen.getByText('Services')).toBeInTheDocument()
    expect(screen.getByText('APEX Apps')).toBeInTheDocument()
    expect(screen.getByText('Architecture')).toBeInTheDocument()
    expect(screen.getByText('SQL Queries')).toBeInTheDocument()
    expect(screen.getByText('Security')).toBeInTheDocument()
    expect(screen.getByText('Data Retention')).toBeInTheDocument()
    expect(screen.getByText('Troubleshooting')).toBeInTheDocument()
  })
})