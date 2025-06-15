'use client';

import { useState } from 'react';

interface KeyboardShortcut {
  key: string;
  description: string;
}

interface CameraControlsUIProps {
  showShortcuts: boolean;
  onToggleShortcuts: () => void;
}

const shortcuts: KeyboardShortcut[] = [
  { key: 'R', description: 'Reset camera view' },
  { key: 'G', description: 'Toggle grade heatmap' },
  { key: 'E', description: 'Focus next equipment' },
  { key: 'L', description: 'Toggle equipment labels' },
  { key: 'H', description: 'Toggle help panel' },
  { key: 'F', description: 'Toggle fullscreen' },
];

export default function CameraControlsUI({ showShortcuts, onToggleShortcuts }: CameraControlsUIProps) {
  return (
    <>
      {/* Keyboard shortcuts panel */}
      {showShortcuts && (
        <div className="absolute top-4 right-4 bg-black/80 text-white p-4 rounded-lg backdrop-blur-sm z-50">
          <h3 className="text-lg font-semibold mb-3">Keyboard Shortcuts</h3>
          <div className="space-y-2">
            {shortcuts.map(({ key, description }) => (
              <div key={key} className="flex items-center gap-3">
                <kbd className="px-2 py-1 bg-gray-700 rounded text-sm font-mono min-w-[2rem] text-center">
                  {key}
                </kbd>
                <span className="text-sm">{description}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-600">
            <p className="text-xs text-gray-400">
              Double-click on equipment to focus
            </p>
          </div>
        </div>
      )}
      
      {/* Help button */}
      <button
        onClick={onToggleShortcuts}
        className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg backdrop-blur-sm transition-colors z-40"
        title="Show keyboard shortcuts (H)"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
    </>
  );
}