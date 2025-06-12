'use client'

import { MainNavigation } from '../navigation/MainNavigation'
import { WebSocketProvider } from '@/providers/WebSocketProvider'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <WebSocketProvider>
      <div className="min-h-screen bg-slate-900">
        <MainNavigation />
        <main className="container mx-auto px-4 py-6">
          {children}
        </main>
      </div>
    </WebSocketProvider>
  )
}