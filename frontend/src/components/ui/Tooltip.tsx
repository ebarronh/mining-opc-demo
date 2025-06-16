'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  disabled?: boolean;
  delay?: number;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = 'top',
  className = '',
  disabled = false,
  delay = 300
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const calculatePosition = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    let x = 0;
    let y = 0;

    switch (placement) {
      case 'top':
        x = rect.left + scrollX + rect.width / 2;
        y = rect.top + scrollY - 8;
        break;
      case 'bottom':
        x = rect.left + scrollX + rect.width / 2;
        y = rect.bottom + scrollY + 8;
        break;
      case 'left':
        x = rect.left + scrollX - 8;
        y = rect.top + scrollY + rect.height / 2;
        break;
      case 'right':
        x = rect.right + scrollX + 8;
        y = rect.top + scrollY + rect.height / 2;
        break;
    }

    setPosition({ x, y });
  };

  const showTooltip = () => {
    if (disabled) return;
    
    timeoutRef.current = setTimeout(() => {
      calculatePosition();
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getTooltipTransform = () => {
    switch (placement) {
      case 'top':
        return 'translate(-50%, -100%)';
      case 'bottom':
        return 'translate(-50%, 0%)';
      case 'left':
        return 'translate(-100%, -50%)';
      case 'right':
        return 'translate(0%, -50%)';
      default:
        return 'translate(-50%, -100%)';
    }
  };

  const getArrowClasses = () => {
    const baseClasses = 'absolute w-0 h-0 border-4';
    switch (placement) {
      case 'top':
        return `${baseClasses} border-l-transparent border-r-transparent border-b-0 border-t-slate-700 top-full left-1/2 transform -translate-x-1/2`;
      case 'bottom':
        return `${baseClasses} border-l-transparent border-r-transparent border-t-0 border-b-slate-700 bottom-full left-1/2 transform -translate-x-1/2`;
      case 'left':
        return `${baseClasses} border-t-transparent border-b-transparent border-r-0 border-l-slate-700 left-full top-1/2 transform -translate-y-1/2`;
      case 'right':
        return `${baseClasses} border-t-transparent border-b-transparent border-l-0 border-r-slate-700 right-full top-1/2 transform -translate-y-1/2`;
      default:
        return `${baseClasses} border-l-transparent border-r-transparent border-b-0 border-t-slate-700 top-full left-1/2 transform -translate-x-1/2`;
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-block"
      >
        {children}
      </div>

      {isVisible && !disabled && typeof document !== 'undefined' &&
        createPortal(
          <div
            className={`
              fixed z-50 pointer-events-none
              bg-slate-700 border border-slate-600 rounded-lg shadow-xl
              px-3 py-2 text-sm text-white max-w-sm
              animate-in fade-in-0 zoom-in-95 duration-200
              ${className}
            `}
            style={{
              left: position.x,
              top: position.y,
              transform: getTooltipTransform(),
            }}
          >
            <div className={getArrowClasses()} />
            {content}
          </div>,
          document.body
        )}
    </>
  );
};

export default Tooltip;