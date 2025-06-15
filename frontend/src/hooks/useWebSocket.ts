'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export type WebSocketState = 'connecting' | 'connected' | 'disconnected' | 'error'

export interface WebSocketMessage {
  type: string
  data?: any
  timestamp?: string
  [key: string]: any
}

// Message queue for performance optimization
interface MessageQueue {
  messages: WebSocketMessage[]
  lastProcessed: number
}

export interface UseWebSocketOptions {
  reconnectAttempts?: number
  reconnectInterval?: number
  messageQueueSize?: number
  processingInterval?: number
  onOpen?: () => void
  onClose?: () => void
  onError?: (error: Event) => void
  onMessage?: (message: WebSocketMessage) => void
  onEquipmentPositions?: (data: any) => void
  onGradeData?: (data: any) => void
  onOpcUaUpdates?: (data: any) => void
}

export interface UseWebSocketReturn {
  state: WebSocketState
  isConnected: boolean
  lastMessage: WebSocketMessage | null
  send: (message: WebSocketMessage) => void
  connect: () => void
  disconnect: () => void
  reconnect: () => void
  messageHistory: WebSocketMessage[]
  connectionAttempts: number
  queueSize: number
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4841/ws'

// Global WebSocket instance tracking to prevent multiple connections in development
let globalWsRef: { current: WebSocket | null } = { current: null }

if (typeof window !== 'undefined') {
  // Ensure we clean up any existing connection on page reload
  window.addEventListener('beforeunload', () => {
    if (globalWsRef.current) {
      globalWsRef.current.close(1000, 'Page unload')
      globalWsRef.current = null
    }
  })
}

export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketReturn {
  const {
    reconnectAttempts = 3,
    reconnectInterval = 1000,
    messageQueueSize = 50,
    processingInterval = 100,
    onOpen,
    onClose,
    onError,
    onMessage,
    onEquipmentPositions,
    onGradeData,
    onOpcUaUpdates
  } = options

  const [state, setState] = useState<WebSocketState>('disconnected')
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)
  const [messageHistory, setMessageHistory] = useState<WebSocketMessage[]>([])
  const [connectionAttempts, setConnectionAttempts] = useState(0)

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const shouldReconnectRef = useRef(true)
  const messageQueueRef = useRef<MessageQueue>({ messages: [], lastProcessed: Date.now() })
  const processingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const isConnected = state === 'connected'

  const clearReconnectTimeout = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
  }, [])

  const addToHistory = useCallback((message: WebSocketMessage) => {
    setMessageHistory(prev => {
      const newHistory = [message, ...prev].slice(0, 100) // Keep last 100 messages
      return newHistory
    })
  }, [])

  // Process specific message types with handlers
  const processMessage = useCallback((message: WebSocketMessage) => {
    switch (message.type) {
      case 'equipment_positions':
        onEquipmentPositions?.(message.payload || message.data)
        break
      case 'grade_data':
        onGradeData?.(message.payload || message.data)
        break
      case 'opcua_updates':
        onOpcUaUpdates?.(message.payload || message.data)
        break
      default:
        // Handle generic message
        onMessage?.(message)
        break
    }
  }, [onEquipmentPositions, onGradeData, onOpcUaUpdates, onMessage])

  // Queue message for processing
  const queueMessage = useCallback((message: WebSocketMessage) => {
    const queue = messageQueueRef.current
    queue.messages.push(message)
    
    // Limit queue size for performance
    if (queue.messages.length > messageQueueSize) {
      queue.messages = queue.messages.slice(-messageQueueSize)
    }
  }, [messageQueueSize])

  // Process queued messages at intervals
  const processMessageQueue = useCallback(() => {
    const queue = messageQueueRef.current
    const now = Date.now()
    
    // Only process if enough time has passed
    if (now - queue.lastProcessed < processingInterval) {
      return
    }
    
    // Process all queued messages
    const messagesToProcess = [...queue.messages]
    queue.messages = []
    queue.lastProcessed = now
    
    messagesToProcess.forEach(message => {
      processMessage(message)
      setLastMessage(message)
      addToHistory(message)
    })
  }, [processingInterval, processMessage, addToHistory])

  const connect = useCallback(() => {
    // Check if there's already a global connection
    if (globalWsRef.current?.readyState === WebSocket.OPEN) {
      console.log('Using existing global WebSocket connection')
      wsRef.current = globalWsRef.current
      setState('connected')
      return
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected, skipping connection attempt')
      return // Already connected
    }

    // Close any existing connection first
    if (wsRef.current) {
      console.log('Closing existing WebSocket connection before creating new one')
      wsRef.current.close()
      wsRef.current = null
    }

    // Close global connection if it exists but is not open
    if (globalWsRef.current && globalWsRef.current.readyState !== WebSocket.OPEN) {
      globalWsRef.current.close()
      globalWsRef.current = null
    }

    console.log('Creating new WebSocket connection to:', WS_URL)
    setState('connecting')
    clearReconnectTimeout()

    try {
      const ws = new WebSocket(WS_URL)
      wsRef.current = ws
      globalWsRef.current = ws

      ws.onopen = () => {
        console.log('WebSocket connected to:', WS_URL)
        setState('connected')
        setConnectionAttempts(0)
        onOpen?.()
      }

      ws.onclose = (event) => {
        // Only log if it's not a normal closure
        if (event.code !== 1000) {
          console.log('WebSocket connection closed:', event.code, event.reason || 'No reason provided')
        }
        setState('disconnected')
        wsRef.current = null
        globalWsRef.current = null
        onClose?.()

        // Attempt reconnection if enabled and not manually disconnected
        if (shouldReconnectRef.current && event.code !== 1000) {
          setConnectionAttempts(prevAttempts => {
            if (prevAttempts < reconnectAttempts) {
              const delay = reconnectInterval * Math.pow(2, prevAttempts) // Exponential backoff
              console.log(`Reconnecting in ${delay}ms (attempt ${prevAttempts + 1}/${reconnectAttempts})`)
              
              reconnectTimeoutRef.current = setTimeout(() => {
                connect()
              }, delay)
              
              return prevAttempts + 1
            } else {
              console.warn('Max reconnection attempts reached. Please check if the backend is running.')
              setState('error')
              return prevAttempts
            }
          })
        }
      }

      ws.onerror = (event) => {
        // WebSocket errors don't provide much detail, but we can infer from readyState
        if (ws.readyState === WebSocket.CONNECTING) {
          console.warn('WebSocket failed to connect to:', WS_URL)
        }
        setState('error')
        onError?.(event)
      }

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          console.log('WebSocket message received:', message.type)
          
          // Add to queue for batch processing
          queueMessage(message)
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err, event.data)
        }
      }

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
      setState('error')
    }
  }, [reconnectAttempts, reconnectInterval, onOpen, onClose, onError, queueMessage, clearReconnectTimeout])

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false
    clearReconnectTimeout()
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect')
      wsRef.current = null
    }
    
    setState('disconnected')
    setConnectionAttempts(0)
  }, [clearReconnectTimeout])

  const reconnect = useCallback(() => {
    shouldReconnectRef.current = true
    setConnectionAttempts(0)
    disconnect()
    setTimeout(connect, 100) // Small delay before reconnecting
  }, [connect, disconnect])

  const send = useCallback((message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const messageWithTimestamp = {
        ...message,
        timestamp: new Date().toISOString()
      }
      
      wsRef.current.send(JSON.stringify(messageWithTimestamp))
      console.log('WebSocket message sent:', messageWithTimestamp.type)
    } else {
      console.warn('Cannot send message: WebSocket is not connected')
    }
  }, [])

  // Set up message processing interval
  useEffect(() => {
    processingIntervalRef.current = setInterval(processMessageQueue, processingInterval)
    
    return () => {
      if (processingIntervalRef.current) {
        clearInterval(processingIntervalRef.current)
        processingIntervalRef.current = null
      }
    }
  }, [processMessageQueue, processingInterval])

  // Auto-connect on mount
  useEffect(() => {
    shouldReconnectRef.current = true
    
    // Add a small delay to prevent multiple connections during fast page reloads
    const connectTimeout = setTimeout(() => {
      connect()
    }, 100)

    // Cleanup on unmount
    return () => {
      clearTimeout(connectTimeout)
      shouldReconnectRef.current = false
      clearReconnectTimeout()
      if (processingIntervalRef.current) {
        clearInterval(processingIntervalRef.current)
        processingIntervalRef.current = null
      }
      if (wsRef.current) {
        console.log('Cleaning up WebSocket connection on unmount')
        wsRef.current.close(1000, 'Component unmount')
        wsRef.current = null
      }
    }
  }, []) // Remove connect from dependencies to prevent recreation loops

  return {
    state,
    isConnected,
    lastMessage,
    send,
    connect,
    disconnect,
    reconnect,
    messageHistory,
    connectionAttempts,
    queueSize: messageQueueRef.current.messages.length
  }
}