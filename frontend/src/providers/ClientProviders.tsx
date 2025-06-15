'use client'

import { WebSocketProvider } from './WebSocketProvider'

interface ClientProvidersProps {
  children: React.ReactNode
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <WebSocketProvider>
      {children}
    </WebSocketProvider>
  )
}