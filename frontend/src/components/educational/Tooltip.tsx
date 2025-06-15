'use client';

import { useState, useEffect, ReactNode } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { HelpCircle, X } from 'lucide-react';
import { miningTerms } from '@/data/miningTerms';

interface TooltipProps {
  children: ReactNode;
  term: string;
  showIcon?: boolean;
  className?: string;
}

// Track which tooltips have been seen
const SEEN_TOOLTIPS_KEY = 'mineSensors.seenTooltips';

function getSeenTooltips(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  
  try {
    const stored = localStorage.getItem(SEEN_TOOLTIPS_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

function markTooltipAsSeen(term: string) {
  const seen = getSeenTooltips();
  seen.add(term);
  localStorage.setItem(SEEN_TOOLTIPS_KEY, JSON.stringify(Array.from(seen)));
}

export function Tooltip({ children, term, showIcon = true, className = '' }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const [hasBeenSeen, setHasBeenSeen] = useState(false);
  
  // Check if tooltip has been seen before
  useEffect(() => {
    setHasBeenSeen(getSeenTooltips().has(term));
  }, [term]);
  
  // Get term definition from our data
  const termData = miningTerms[term.toLowerCase()];
  
  if (!termData) {
    // If no definition found, just render children
    return <>{children}</>;
  }
  
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    
    // Mark as seen when opened
    if (newOpen && !hasBeenSeen) {
      markTooltipAsSeen(term);
      setHasBeenSeen(true);
    }
  };
  
  return (
    <TooltipPrimitive.Provider delayDuration={300}>
      <TooltipPrimitive.Root open={open} onOpenChange={handleOpenChange}>
        <TooltipPrimitive.Trigger asChild>
          <span className={`inline-flex items-center gap-1 ${className}`}>
            {children}
            {showIcon && (
              <HelpCircle 
                className={`
                  w-3 h-3 cursor-help transition-colors
                  ${hasBeenSeen ? 'text-gray-500' : 'text-blue-400 animate-pulse'}
                `} 
              />
            )}
          </span>
        </TooltipPrimitive.Trigger>
        
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            className="
              max-w-sm p-4 bg-slate-800 border border-slate-600 rounded-lg shadow-xl
              animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out 
              data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
              data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 
              data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2
            "
            sideOffset={5}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h4 className="text-sm font-semibold text-white">{termData.term}</h4>
                <button
                  onClick={() => setOpen(false)}
                  className="p-0.5 hover:bg-slate-700 rounded transition-colors"
                >
                  <X className="w-3 h-3 text-gray-400" />
                </button>
              </div>
              
              <p className="text-xs text-gray-300 leading-relaxed">
                {termData.definition}
              </p>
              
              {termData.example && (
                <div className="pt-2 border-t border-slate-700">
                  <p className="text-xs text-gray-400">
                    <span className="font-medium">Example:</span> {termData.example}
                  </p>
                </div>
              )}
              
              {termData.unit && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-400">Unit:</span>
                  <code className="px-1.5 py-0.5 bg-slate-700 rounded text-blue-400">
                    {termData.unit}
                  </code>
                </div>
              )}
              
              {termData.category && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 bg-slate-700 rounded text-gray-400">
                    {termData.category}
                  </span>
                </div>
              )}
            </div>
            
            <TooltipPrimitive.Arrow className="fill-slate-800" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

// Convenience component for wrapping text with automatic term detection
interface AutoTooltipProps {
  text: string;
  className?: string;
}

export function AutoTooltip({ text, className = '' }: AutoTooltipProps) {
  // Split text and wrap mining terms with tooltips
  const words = text.split(/(\s+)/);
  
  return (
    <span className={className}>
      {words.map((word, index) => {
        const cleanWord = word.toLowerCase().replace(/[.,!?;:]$/g, '');
        
        if (miningTerms[cleanWord]) {
          return (
            <Tooltip key={index} term={cleanWord} showIcon={false}>
              <span className="underline decoration-dotted decoration-gray-500 underline-offset-2 cursor-help">
                {word}
              </span>
            </Tooltip>
          );
        }
        
        return <span key={index}>{word}</span>;
      })}
    </span>
  );
}