'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { HelpCircle, ExternalLink, X } from 'lucide-react';
import { useHelpMode } from '@/providers/HelpModeProvider';

interface HelpTargetProps {
  children: ReactNode;
  helpId: string;
  title: string;
  description: string;
  category?: 'navigation' | 'feature' | 'data' | 'action';
  learnMoreUrl?: string;
  className?: string;
}

export function HelpTarget({
  children,
  helpId,
  title,
  description,
  category = 'feature',
  learnMoreUrl,
  className = ''
}: HelpTargetProps) {
  const { isHelpMode, registerHelpContent, unregisterHelpContent } = useHelpMode();
  const [showHelp, setShowHelp] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  
  // Register help content on mount
  useEffect(() => {
    registerHelpContent(helpId, { title, description, category, learnMoreUrl });
    return () => unregisterHelpContent(helpId);
  }, [helpId, title, description, category, learnMoreUrl, registerHelpContent, unregisterHelpContent]);
  
  const handleClick = (e: React.MouseEvent) => {
    if (isHelpMode) {
      e.preventDefault();
      e.stopPropagation();
      setShowHelp(true);
    }
  };
  
  const categoryColors = {
    navigation: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    feature: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    data: 'bg-green-500/10 text-green-400 border-green-500/20',
    action: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
  };
  
  const categoryIcons = {
    navigation: '🧭',
    feature: '⚡',
    data: '📊',
    action: '🎯'
  };
  
  return (
    <>
      <div
        ref={elementRef}
        onClick={handleClick}
        className={`
          ${isHelpMode ? 'relative cursor-help' : ''}
          ${className}
        `}
      >
        {children}
        
        {/* Help mode indicator */}
        {isHelpMode && (
          <div className="absolute -top-2 -right-2 z-50 pointer-events-none animate-in zoom-in-50">
            <div className="relative">
              <HelpCircle className="w-5 h-5 text-blue-400 animate-pulse" />
              <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75" />
            </div>
          </div>
        )}
      </div>
      
      {/* Help Dialog */}
      <Dialog.Root open={showHelp} onOpenChange={setShowHelp}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in-0 z-50" />
          
          <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-md bg-slate-900 border border-slate-700 rounded-lg shadow-xl animate-in fade-in-0 zoom-in-95 z-50">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <Dialog.Title className="text-xl font-bold text-white flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-blue-400" />
                    {title}
                  </Dialog.Title>
                  <div className="flex items-center gap-2 mt-2">
                    <span 
                      className={`
                        inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border
                        ${categoryColors[category]}
                      `}
                    >
                      <span>{categoryIcons[category]}</span>
                      {category}
                    </span>
                  </div>
                </div>
                
                <Dialog.Close asChild>
                  <button className="p-1 hover:bg-slate-800 rounded transition-colors">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </Dialog.Close>
              </div>
              
              {/* Description */}
              <Dialog.Description className="text-sm text-gray-300 leading-relaxed mb-4">
                {description}
              </Dialog.Description>
              
              {/* Learn More Link */}
              {learnMoreUrl && (
                <a
                  href={learnMoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Learn more
                </a>
              )}
              
              {/* Tips */}
              <div className="mt-4 p-3 bg-slate-800 border border-slate-700 rounded-md">
                <p className="text-xs text-gray-400">
                  <span className="font-medium text-gray-300">Tip:</span> Press{' '}
                  <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-gray-300">Esc</kbd>{' '}
                  to exit help mode, or{' '}
                  <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-gray-300">Shift + ?</kbd>{' '}
                  to toggle help mode.
                </p>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

// Higher-order component for adding help to existing components
export function withHelp<P extends object>(
  Component: React.ComponentType<P>,
  helpProps: Omit<HelpTargetProps, 'children'>
) {
  return function WithHelpComponent(props: P) {
    return (
      <HelpTarget {...helpProps}>
        <Component {...props} />
      </HelpTarget>
    );
  };
}