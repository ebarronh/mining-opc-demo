'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { HelpCircle, X } from 'lucide-react';

interface HelpModeContextType {
  isHelpMode: boolean;
  toggleHelpMode: () => void;
  registerHelpContent: (id: string, content: HelpContent) => void;
  unregisterHelpContent: (id: string) => void;
  getHelpContent: (id: string) => HelpContent | undefined;
}

interface HelpContent {
  title: string;
  description: string;
  category?: 'navigation' | 'feature' | 'data' | 'action';
  learnMoreUrl?: string;
}

const HelpModeContext = createContext<HelpModeContextType | undefined>(undefined);

export function useHelpMode() {
  const context = useContext(HelpModeContext);
  if (!context) {
    throw new Error('useHelpMode must be used within a HelpModeProvider');
  }
  return context;
}

interface HelpModeProviderProps {
  children: ReactNode;
}

export function HelpModeProvider({ children }: HelpModeProviderProps) {
  const [isHelpMode, setIsHelpMode] = useState(false);
  const [helpContent, setHelpContent] = useState<Map<string, HelpContent>>(new Map());
  
  // Toggle help mode with keyboard shortcut (Shift + ?)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === '?') {
        setIsHelpMode(prev => !prev);
      }
      // Exit help mode with Escape
      if (e.key === 'Escape' && isHelpMode) {
        setIsHelpMode(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isHelpMode]);
  
  const toggleHelpMode = useCallback(() => {
    setIsHelpMode(prev => !prev);
  }, []);
  
  const registerHelpContent = useCallback((id: string, content: HelpContent) => {
    setHelpContent(prev => {
      const next = new Map(prev);
      next.set(id, content);
      return next;
    });
  }, []);
  
  const unregisterHelpContent = useCallback((id: string) => {
    setHelpContent(prev => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);
  
  const getHelpContent = useCallback((id: string) => {
    return helpContent.get(id);
  }, [helpContent]);
  
  const contextValue = useMemo(
    () => ({
      isHelpMode,
      toggleHelpMode,
      registerHelpContent,
      unregisterHelpContent,
      getHelpContent
    }),
    [isHelpMode, toggleHelpMode, registerHelpContent, unregisterHelpContent, getHelpContent]
  );

  return (
    <HelpModeContext.Provider value={contextValue}>
      {children}
      
      {/* Help Mode Indicator */}
      {isHelpMode && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-2">
          <div className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
            <HelpCircle className="w-5 h-5 animate-pulse" />
            <span className="text-sm font-medium">Help Mode Active - Click any element to learn more</span>
            <button
              onClick={() => setIsHelpMode(false)}
              className="p-1 hover:bg-blue-600 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      
      {/* Visual indicator overlay */}
      {isHelpMode && (
        <div 
          className="fixed inset-0 pointer-events-none z-40"
          style={{
            background: 'radial-gradient(circle at center, transparent 0%, rgba(59, 130, 246, 0.05) 100%)',
            backdropFilter: 'contrast(1.05)'
          }}
        />
      )}
    </HelpModeContext.Provider>
  );
}

// Help Mode Toggle Button Component
export function HelpModeToggle({ className = '' }: { className?: string }) {
  const { isHelpMode, toggleHelpMode } = useHelpMode();
  
  return (
    <button
      onClick={toggleHelpMode}
      className={`
        p-2 rounded-lg transition-all duration-200
        ${isHelpMode 
          ? 'bg-blue-500 text-white hover:bg-blue-600' 
          : 'bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white'
        }
        ${className}
      `}
      title={isHelpMode ? 'Exit Help Mode' : 'Enter Help Mode (Shift + ?)'}
    >
      <HelpCircle className="w-5 h-5" />
    </button>
  );
}