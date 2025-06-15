'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useWebSocket, UseWebSocketReturn, WebSocketMessage } from '@/hooks/useWebSocket'
import type { EquipmentPosition, GradeData, OpcUaUpdate } from '@/types/websocket'

interface WebSocketContextType extends UseWebSocketReturn {
  // Mining-specific message types
  subscribeTo: (equipment: string[]) => void
  unsubscribeFrom: (equipment: string[]) => void
  triggerScenario: (scenario: string, parameters?: Record<string, any>) => void
  getEquipmentList: () => void
  ping: () => void
  // New message type handlers
  equipmentPositions: EquipmentPosition[]
  gradeData: GradeData | null
  opcUaUpdates: OpcUaUpdate[]
}

const WebSocketContext = createContext<WebSocketContextType | null>(null)

interface WebSocketProviderProps {
  children: ReactNode
}

// State management for real-time data
interface WebSocketState {
  equipmentPositions: EquipmentPosition[]
  gradeData: GradeData | null
  opcUaUpdates: OpcUaUpdate[]
}

const initialState: WebSocketState = {
  equipmentPositions: [],
  gradeData: null,
  opcUaUpdates: []
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const [state, setState] = React.useState<WebSocketState>(initialState)

  const webSocket = useWebSocket({
    onOpen: () => {
      console.log('🔗 WebSocket connected to mining demo backend')
    },
    onClose: () => {
      console.log('🔌 WebSocket disconnected from mining demo backend')
    },
    onError: (event) => {
      console.log('❌ WebSocket connection error')
    },
    onEquipmentPositions: (data) => {
      console.log('🚛 Equipment positions updated:', data.equipment?.length || 0, 'items')
      setState(prev => ({
        ...prev,
        equipmentPositions: data.equipment || []
      }))
    },
    onGradeData: (data) => {
      console.log('📊 Grade data updated')
      setState(prev => ({
        ...prev,
        gradeData: data
      }))
    },
    onOpcUaUpdates: (data) => {
      console.log('🔄 OPC UA updates received:', data.updates?.length || 0, 'updates')
      setState(prev => ({
        ...prev,
        opcUaUpdates: data.updates || []
      }))
    },
    onMessage: (message: WebSocketMessage) => {
      // Handle other message types for mining demo
      switch (message.type) {
        case 'connection_established':
          console.log('✅ Mining demo connection established:', message.payload?.message)
          break
        case 'subscription_confirmed':
          console.log('📺 Subscription confirmed for:', message.payload?.nodeId)
          break
        case 'subscription_cancelled':
          console.log('📺 Subscription cancelled for:', message.payload?.nodeId)
          break
        case 'heartbeat':
          console.log('💓 Heartbeat received')
          break
        case 'pong':
          console.log('🏓 Pong received')
          break
        case 'system_status':
          console.log('🔧 System status:', message.payload?.status)
          break
        case 'error':
          console.error('⚠️ Server error:', message.payload?.message)
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
    ping,
    equipmentPositions: state.equipmentPositions,
    gradeData: state.gradeData,
    opcUaUpdates: state.opcUaUpdates
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