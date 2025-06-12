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
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return // Already connected
    }

    setState('connecting')
    clearReconnectTimeout()

    try {
      const ws = new WebSocket(WS_URL)
      wsRef.current = ws

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
        if (shouldReconnectRef.current && connectionAttempts < reconnectAttempts) {
          const delay = reconnectInterval * Math.pow(2, connectionAttempts) // Exponential backoff
          console.log(`Attempting to reconnect in ${delay}ms (attempt ${connectionAttempts + 1}/${reconnectAttempts})`)
          
          reconnectTimeoutRef.current = setTimeout(() => {
            setConnectionAttempts(prev => prev + 1)
            connect()
          }, delay)
        } else if (connectionAttempts >= reconnectAttempts) {
          console.warn('Max reconnection attempts reached')
          setState('error')
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
  }, [connectionAttempts, reconnectAttempts, reconnectInterval, onOpen, onClose, onError, onMessage, addToHistory, clearReconnectTimeout])

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
    connect()

    // Cleanup on unmount
    return () => {
      shouldReconnectRef.current = false
      clearReconnectTimeout()
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmount')
      }
    }
  }, [connect, clearReconnectTimeout])

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