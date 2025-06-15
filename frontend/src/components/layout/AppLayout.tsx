'use client'

import { MainNavigation } from '../navigation/MainNavigation'
import { HelpModeProvider } from '@/providers/HelpModeProvider'
import { Glossary } from '../educational/Glossary'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <HelpModeProvider>
      <div className="min-h-screen bg-slate-900">
        <MainNavigation />
        <main className="container mx-auto px-4 py-6">
          {children}
        </main>
        <Glossary />
      </div>
    </HelpModeProvider>
  )
}