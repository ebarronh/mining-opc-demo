'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export type WebSocketState = 'connecting' | 'connected' | 'disconnected' | 'error'

export interface WebSocketMessage {
  type: string
  data?: any
  timestamp?: string
  [key: string]: any
}

export interface UseWebSocketOptions {
  reconnectAttempts?: number
  reconnectInterval?: number
  onOpen?: () => void
  onClose?: () => void
  onError?: (error: Event) => void
  onMessage?: (message: WebSocketMessage) => void
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
    onOpen,
    onClose,
    onError,
    onMessage
  } = options

  const [state, setState] = useState<WebSocketState>('disconnected')
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)
  const [messageHistory, setMessageHistory] = useState<WebSocketMessage[]>([])
  const [connectionAttempts, setConnectionAttempts] = useState(0)

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const shouldReconnectRef = useRef(true)

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
        console.log('WebSocket connection closed:', event.code, event.reason)
        setState('disconnected')
        wsRef.current = null
        onClose?.()

        // Attempt reconnection if enabled and not manually disconnected
        if (shouldReconnectRef.current) {
          setConnectionAttempts(prevAttempts => {
            if (prevAttempts < reconnectAttempts) {
              const delay = reconnectInterval * Math.pow(2, prevAttempts) // Exponential backoff
              console.log(`Attempting to reconnect in ${delay}ms (attempt ${prevAttempts + 1}/${reconnectAttempts})`)
              
              reconnectTimeoutRef.current = setTimeout(() => {
                connect()
              }, delay)
              
              return prevAttempts + 1
            } else {
              console.warn('Max reconnection attempts reached')
              setState('error')
              return prevAttempts
            }
          })
        }
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        setState('error')
        onError?.(error)
      }

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          console.log('WebSocket message received:', message.type)
          
          setLastMessage(message)
          addToHistory(message)
          onMessage?.(message)
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err, event.data)
        }
      }

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
      setState('error')
    }
  }, [reconnectAttempts, reconnectInterval, onOpen, onClose, onError, onMessage, addToHistory, clearReconnectTimeout])

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
    connectionAttempts
  }
}