'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useWebSocket, UseWebSocketReturn, WebSocketMessage } from '@/hooks/useWebSocket'

interface WebSocketContextType extends UseWebSocketReturn {
  // Mining-specific message types
  subscribeTo: (equipment: string[]) => void
  unsubscribeFrom: (equipment: string[]) => void
  triggerScenario: (scenario: string, parameters?: Record<string, any>) => void
  getEquipmentList: () => void
  ping: () => void
}

const WebSocketContext = createContext<WebSocketContextType | null>(null)

interface WebSocketProviderProps {
  children: ReactNode
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const webSocket = useWebSocket({
    onOpen: () => {
      console.log('🔗 WebSocket connected to mining demo backend')
    },
    onClose: () => {
      console.log('🔌 WebSocket disconnected from mining demo backend')
    },
    onError: (error) => {
      console.error('❌ WebSocket error:', error)
    },
    onMessage: (message: WebSocketMessage) => {
      // Handle specific message types for mining demo
      switch (message.type) {
        case 'connection':
          console.log('✅ Mining demo connection established:', message.message)
          break
        case 'mining_data':
          console.log('📊 Mining data received:', message.data?.siteMetrics)
          break
        case 'subscription_confirmed':
          console.log('📺 Subscription confirmed for:', message.equipment)
          break
        case 'scenario_response':
          console.log('🎬 Scenario response:', message.scenario, message.success)
          break
        case 'equipment_list':
          console.log('🚛 Equipment list received:', message.equipment)
          break
        case 'error':
          console.error('⚠️ Server error:', message.message)
          break
        default:
          console.log('📨 Unknown message type:', message.type)
      }
    }
  })

  // Mining-specific helper functions
  const subscribeTo = (equipment: string[]) => {
    webSocket.send({
      type: 'subscribe',
      equipment
    })
  }

  const unsubscribeFrom = (equipment: string[]) => {
    webSocket.send({
      type: 'unsubscribe',
      equipment
    })
  }

  const triggerScenario = (scenario: string, parameters: Record<string, any> = {}) => {
    webSocket.send({
      type: 'trigger_scenario',
      scenario,
      parameters
    })
  }

  const getEquipmentList = () => {
    webSocket.send({
      type: 'get_equipment_list'
    })
  }

  const ping = () => {
    webSocket.send({
      type: 'ping'
    })
  }

  const contextValue: WebSocketContextType = {
    ...webSocket,
    subscribeTo,
    unsubscribeFrom,
    triggerScenario,
    getEquipmentList,
    ping
  }

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  )
}

export function useWebSocketContext(): WebSocketContextType {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider')
  }
  return context
}