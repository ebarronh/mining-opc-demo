'use client'

import * as Tabs from '@radix-ui/react-tabs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, Globe, Link as LinkIcon, CheckCircle, Pickaxe, AlertTriangle } from 'lucide-react'
import { useSystemStatus } from '@/hooks/useSystemStatus'
import { HelpModeToggle } from '@/providers/HelpModeProvider'
import { HelpTarget } from '../educational/HelpTarget'

interface NavigationTab {
  id: string
  label: string
  href: string
  icon: React.ReactNode
  description: string
}

const navigationTabs: NavigationTab[] = [
  {
    id: 'real-time',
    label: 'Real-time Monitor',
    href: '/real-time',
    icon: <BarChart3 className="w-4 h-4" />,
    description: '3D mine visualization with live equipment tracking'
  },
  {
    id: 'explorer',
    label: 'OPC UA Explorer',
    href: '/explorer',
    icon: <Globe className="w-4 h-4" />,
    description: 'Browse mining equipment nodes and live values'
  },
  {
    id: 'integration',
    label: 'Integration Hub',
    href: '/integration',
    icon: <LinkIcon className="w-4 h-4" />,
    description: 'ISA-95 flow and FMS connectivity'
  },
  {
    id: 'compliance',
    label: 'Compliance',
    href: '/compliance',
    icon: <CheckCircle className="w-4 h-4" />,
    description: 'OPC UA Mining standards compliance'
  }
]

export function MainNavigation() {
  const pathname = usePathname()
  const { status, error, loading } = useSystemStatus(10000) // Update every 10 seconds for nav
  
  // Determine active tab based on current route
  const getActiveTab = () => {
    if (!pathname || pathname === '/') return 'home'
    const currentTab = navigationTabs.find(tab => pathname.startsWith(tab.href))
    return currentTab?.id || 'home'
  }

  const getSystemStatusIndicator = () => {
    if (loading && !status) {
      return (
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-slate-300">Connecting...</span>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span className="text-sm text-red-400">Backend Offline</span>
        </div>
      )
    }

    if (status) {
      const isHealthy = status.status === 'healthy'
      const isDegraded = status.status === 'degraded'
      
      return (
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            isHealthy ? 'bg-green-400 animate-pulse' : 
            isDegraded ? 'bg-yellow-400' : 'bg-red-400'
          }`}></div>
          <span className={`text-sm ${
            isHealthy ? 'text-green-400' : 
            isDegraded ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {isHealthy ? 'All Systems Online' : 
             isDegraded ? 'System Degraded' : 'System Issues'}
          </span>
        </div>
      )
    }

    return (
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        <span className="text-sm text-slate-400">Unknown Status</span>
      </div>
    )
  }

  return (
    <div className="border-b border-slate-700 bg-slate-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg group-hover:from-blue-400 group-hover:to-blue-500 transition-all duration-200">
              <Pickaxe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                MineSensors OPC UA
              </h1>
              <p className="text-sm text-slate-400">Mining Demo Platform</p>
            </div>
          </Link>
          
          {/* Status Indicator and Help Toggle */}
          <div className="flex items-center space-x-4">
            <HelpModeToggle />
            {getSystemStatusIndicator()}
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs.Root value={getActiveTab()} className="w-full">
          <Tabs.List className="flex space-x-1 p-1 bg-slate-800/50 rounded-lg">
            {/* Home Tab */}
            <Tabs.Trigger
              value="home"
              className="flex-1 group data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
              asChild
            >
              <Link href="/" className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-slate-400 to-slate-500 group-data-[state=active]:from-blue-400 group-data-[state=active]:to-blue-500"></div>
                <span>Overview</span>
              </Link>
            </Tabs.Trigger>

            {/* Dynamic Navigation Tabs */}
            {navigationTabs.map((tab) => (
              <Tabs.Trigger
                key={tab.id}
                value={tab.id}
                className="flex-1 group data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                asChild
              >
                <Link href={tab.href} className="flex items-center justify-center space-x-2">
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </Link>
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>

        {/* Tab Descriptions */}
        {pathname && pathname !== '/' && (
          <div className="py-3 border-t border-slate-700/50 mt-4">
            {navigationTabs.map((tab) => (
              pathname.startsWith(tab.href) && (
                <div key={tab.id} className="flex items-center space-x-3">
                  <div className="text-blue-400">{tab.icon}</div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{tab.label}</h2>
                    <p className="text-sm text-slate-400">{tab.description}</p>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  )
}