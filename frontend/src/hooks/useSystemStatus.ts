'use client'

import { useState, useEffect } from 'react'

interface SystemStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  opcua: {
    server_running: boolean
    client_connections: number
    data_updates_per_second: number
  }
  websocket: {
    active_connections: number
    messages_sent: number
  }
  simulation: {
    equipment_count: number
    scenarios_running: string[]
  }
  timestamp?: string
}

interface UseSystemStatusReturn {
  status: SystemStatus | null
  loading: boolean
  error: string | null
  lastUpdate: Date | null
  refetch: () => void
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export function useSystemStatus(refreshInterval: number = 5000): UseSystemStatusReturn {
  const [status, setStatus] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`, {
        headers: {
          'Accept': 'application/json',
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(3000)
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data: SystemStatus = await response.json()
      setStatus(data)
      setError(null)
      setLastUpdate(new Date())
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.warn('System status fetch failed:', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    setLoading(true)
    fetchStatus()
  }

  useEffect(() => {
    // Initial fetch
    fetchStatus()

    // Set up interval for periodic updates
    const interval = setInterval(fetchStatus, refreshInterval)

    // Cleanup interval on unmount
    return () => clearInterval(interval)
  }, [refreshInterval])

  return {
    status,
    loading,
    error,
    lastUpdate,
    refetch
  }
}