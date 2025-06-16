'use client';

import { getGradeColorHex, GRADE_RANGES } from '@/utils/gradeColors';
import { BarChart, HelpCircle, Book } from 'lucide-react';
import { HelpTarget } from '@/components/educational/HelpTarget';
import { Tooltip } from '@/components/educational/Tooltip';
import { useState } from 'react';

interface GradeLegendProps {
  visible: boolean;
  className?: string;
}

export default function GradeLegend({ visible, className = '' }: GradeLegendProps) {
  const [showEconomics, setShowEconomics] = useState(false);

  if (!visible) {
    return (
      <div className={`bg-slate-800 border border-slate-600 rounded-xl p-4 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <BarChart className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-semibold text-slate-500">Grade Legend</h3>
          </div>
          <HelpCircle className="w-4 h-4 text-slate-500" />
        </div>
        <p className="text-xs text-slate-500 text-center py-8">
          Enable Grade Heatmap to see legend
        </p>
      </div>
    );
  }

  return (
    <HelpTarget
      helpId="grade-legend"
      title="Understanding Ore Grades & Mining Economics"
      description="Ore grade represents the actual percentage of valuable metal in rock - NOT probability. Even seemingly low percentages like 1-3% generate massive profits due to mining's enormous scale. A mine processing 100,000 tonnes daily at just 1% copper grade produces 1,000 tonnes of pure copper worth ~$8 million per day!"
      category="measurement"
    >
      <div className={`bg-slate-800 border border-slate-600 rounded-xl p-4 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <BarChart className="w-4 h-4 text-orange-400" />
            <h3 className="text-sm font-semibold text-white">
              <Tooltip term="grade" showIcon={false}>
                Grade Legend
              </Tooltip>
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowEconomics(!showEconomics)}
              className="text-xs text-slate-400 hover:text-orange-400 transition-colors"
              title="Toggle economic details"
            >
              {showEconomics ? 'Hide' : 'Show'} Economics
            </button>
            <HelpCircle className="w-4 h-4 text-slate-400 hover:text-orange-400 cursor-help" />
          </div>
        </div>
        
        <div className="space-y-2">
          {GRADE_RANGES.map((range, index) => {
            const economicStatus = range.min >= 2.5 ? 'high grade ore' : 
                                 range.min >= 1.0 ? 'grade' :
                                 range.min >= 0.5 ? 'cutoff' : 'waste rock';
            
            return (
              <Tooltip key={index} term={economicStatus}>
                <div className="flex items-center space-x-3 hover:bg-slate-700/30 p-1 rounded cursor-help">
                  {/* Color indicator */}
                  <div 
                    className="w-4 h-4 rounded border border-slate-500 flex-shrink-0"
                    style={{ backgroundColor: getGradeColorHex(range.min + 0.1) }}
                  />
                  
                  {/* Grade range and description */}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-white font-medium">
                      {range.label}
                    </div>
                    <div className="text-xs text-slate-400">
                      {range.description}
                    </div>
                    {showEconomics && (
                      <div className="text-xs text-slate-500 mt-1 italic">
                        {range.economics}
                      </div>
                    )}
                  </div>
                </div>
              </Tooltip>
            );
          })}
        </div>
        
        <div className="mt-3 pt-3 border-t border-slate-600 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              <Tooltip term="mining economics" showIcon={false}>
                Grade = metal concentration, not probability
              </Tooltip>
            </p>
            <Tooltip term="grade">
              <Book className="w-3 h-3 text-slate-500 hover:text-orange-400 cursor-help" />
            </Tooltip>
          </div>
          
          {showEconomics && (
            <div className="bg-slate-700/30 p-2 rounded text-xs">
              <p className="text-orange-300 font-medium mb-1">💰 Quick Economics:</p>
              <p className="text-slate-300">
                • 1% copper = 10kg per tonne = ~$80/tonne revenue
              </p>
              <p className="text-slate-300">
                • 100k tonnes/day @ 1% = $8M daily copper value
              </p>
              <p className="text-slate-300">
                • Even "low" 0.5% grades are profitable at scale
              </p>
            </div>
          )}
          
          <p className="text-xs text-slate-500">
            💡 Hover/click grade ranges for details | Press 'G' to open glossary
          </p>
        </div>
      </div>
    </HelpTarget>
  );
}