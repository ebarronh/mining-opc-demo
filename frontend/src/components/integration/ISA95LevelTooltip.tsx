'use client';

import React from 'react';
import { Info, Lightbulb, Wrench, BarChart3, AlertTriangle, DollarSign } from 'lucide-react';
import Tooltip from '@/components/ui/Tooltip';
import { ISA95MiningContext, getMiningContextForLevel } from '@/data/isa95MiningContext';

interface ISA95LevelTooltipProps {
  level: number;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const TooltipContent: React.FC<{ context: ISA95MiningContext }> = ({ context }) => {
  return (
    <div className="max-w-md">
      {/* Header */}
      <div className="mb-3 pb-2 border-b border-slate-600">
        <h3 className="font-bold text-white text-sm mb-1">{context.title}</h3>
        <p className="text-slate-300 text-xs leading-relaxed">{context.purpose}</p>
      </div>

      {/* Key Functions */}
      <div className="mb-3">
        <div className="flex items-center space-x-1 mb-2">
          <Wrench className="w-3 h-3 text-blue-400" />
          <span className="text-blue-400 text-xs font-medium">Key Functions</span>
        </div>
        <ul className="text-xs text-slate-300 space-y-1">
          {context.keyFunctions.slice(0, 3).map((func, index) => (
            <li key={index} className="flex items-start space-x-1">
              <span className="text-blue-400 mt-1">•</span>
              <span>{func}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Mining Examples */}
      <div className="mb-3">
        <div className="flex items-center space-x-1 mb-2">
          <BarChart3 className="w-3 h-3 text-green-400" />
          <span className="text-green-400 text-xs font-medium">Mining Examples</span>
        </div>
        <ul className="text-xs text-slate-300 space-y-1">
          {context.miningExamples.slice(0, 2).map((example, index) => (
            <li key={index} className="flex items-start space-x-1">
              <span className="text-green-400 mt-1">•</span>
              <span>{example}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Challenges */}
      {context.challenges.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center space-x-1 mb-2">
            <AlertTriangle className="w-3 h-3 text-yellow-400" />
            <span className="text-yellow-400 text-xs font-medium">Key Challenges</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-1">
            {context.challenges.slice(0, 2).map((challenge, index) => (
              <li key={index} className="flex items-start space-x-1">
                <span className="text-yellow-400 mt-1">•</span>
                <span>{challenge}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Business Impact */}
      <div className="mb-3">
        <div className="flex items-center space-x-1 mb-2">
          <DollarSign className="w-3 h-3 text-purple-400" />
          <span className="text-purple-400 text-xs font-medium">Business Impact</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">{context.businessImpact}</p>
      </div>

      {/* Real World Example */}
      <div className="pt-2 border-t border-slate-600">
        <div className="flex items-center space-x-1 mb-2">
          <Lightbulb className="w-3 h-3 text-orange-400" />
          <span className="text-orange-400 text-xs font-medium">Real-World Example</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed italic">
          "{context.realWorldExample}"
        </p>
      </div>

      {/* Footer hint */}
      <div className="mt-3 pt-2 border-t border-slate-600">
        <div className="flex items-center space-x-1">
          <Info className="w-3 h-3 text-slate-500" />
          <span className="text-slate-500 text-xs">Hover for detailed mining context</span>
        </div>
      </div>
    </div>
  );
};

const ISA95LevelTooltip: React.FC<ISA95LevelTooltipProps> = ({
  level,
  children,
  placement = 'top',
  className = ''
}) => {
  const context = getMiningContextForLevel(level);

  if (!context) {
    return <>{children}</>;
  }

  return (
    <Tooltip
      content={<TooltipContent context={context} />}
      placement={placement}
      className={className}
      delay={500}
    >
      {children}
    </Tooltip>
  );
};

export default ISA95LevelTooltip;