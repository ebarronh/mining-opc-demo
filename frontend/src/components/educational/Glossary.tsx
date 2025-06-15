'use client';

import { useState, useMemo } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { Book, X, Search, ChevronRight } from 'lucide-react';
import { getAllTerms, getCategories, searchTerms, MiningTerm } from '@/data/miningTerms';

interface GlossaryProps {
  className?: string;
}

const categoryIcons = {
  equipment: '⚙️',
  process: '⚒️',
  measurement: '📊',
  safety: '🦺',
  geology: '⛰️',
  technology: '💻'
};

const categoryColors = {
  equipment: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  process: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  measurement: 'bg-green-500/10 text-green-400 border-green-500/20',
  safety: 'bg-red-500/10 text-red-400 border-red-500/20',
  geology: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  technology: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
};

export function Glossary({ className = '' }: GlossaryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  
  const categories = getCategories();
  const allTerms = getAllTerms();
  
  // Filter terms based on search and category
  const filteredTerms = useMemo(() => {
    let terms = searchQuery ? searchTerms(searchQuery) : allTerms;
    
    if (selectedCategory) {
      terms = terms.filter(t => t.category === selectedCategory);
    }
    
    if (selectedLetter) {
      terms = terms.filter(t => 
        t.term.toUpperCase().startsWith(selectedLetter)
      );
    }
    
    // Sort alphabetically
    return terms.sort((a, b) => a.term.localeCompare(b.term));
  }, [searchQuery, selectedCategory, selectedLetter, allTerms]);
  
  // Get available first letters
  const availableLetters = useMemo(() => {
    const letters = new Set(allTerms.map(t => t.term[0].toUpperCase()));
    return Array.from(letters).sort();
  }, [allTerms]);
  
  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedLetter(null);
  };
  
  return (
    <>
      {/* Floating Glossary Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`
          fixed bottom-6 right-6 p-3 bg-blue-500 hover:bg-blue-600 
          text-white rounded-full shadow-lg hover:shadow-xl 
          transition-all duration-200 hover:scale-110 z-40
          ${className}
        `}
        title="Mining Glossary"
      >
        <Book className="w-6 h-6" />
      </button>
      
      {/* Glossary Dialog */}
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in-0 z-40" />
          
          <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-4xl h-[80vh] bg-slate-900 border border-slate-700 rounded-lg shadow-xl animate-in fade-in-0 zoom-in-95 z-50">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <div>
                <Dialog.Title className="text-2xl font-bold text-white flex items-center gap-3">
                  <Book className="w-7 h-7 text-blue-400" />
                  Mining Glossary
                </Dialog.Title>
                <Dialog.Description className="text-sm text-gray-400 mt-1">
                  {filteredTerms.length} of {allTerms.length} terms
                </Dialog.Description>
              </div>
              
              <Dialog.Close asChild>
                <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </Dialog.Close>
            </div>
            
            <div className="flex h-[calc(100%-88px)]">
              {/* Sidebar */}
              <div className="w-64 border-r border-slate-700 p-4 space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search terms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {/* Categories */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    Categories
                  </h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`
                        w-full px-3 py-2 rounded-md text-sm text-left transition-colors
                        ${!selectedCategory 
                          ? 'bg-slate-700 text-white' 
                          : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                        }
                      `}
                    >
                      All Categories
                    </button>
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`
                          w-full px-3 py-2 rounded-md text-sm text-left transition-colors capitalize
                          flex items-center gap-2
                          ${selectedCategory === category 
                            ? 'bg-slate-700 text-white' 
                            : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                          }
                        `}
                      >
                        <span>{categoryIcons[category as keyof typeof categoryIcons]}</span>
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Alphabetical Navigation */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    Alphabetical
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {availableLetters.map(letter => (
                      <button
                        key={letter}
                        onClick={() => setSelectedLetter(letter === selectedLetter ? null : letter)}
                        className={`
                          w-8 h-8 rounded text-sm font-medium transition-colors
                          ${selectedLetter === letter 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white'
                          }
                        `}
                      >
                        {letter}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Reset Filters */}
                {(searchQuery || selectedCategory || selectedLetter) && (
                  <button
                    onClick={handleReset}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-sm text-gray-400 rounded-md transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
              
              {/* Terms List */}
              <ScrollArea.Root className="flex-1">
                <ScrollArea.Viewport className="w-full h-full p-6">
                  {filteredTerms.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No terms found matching your criteria.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {filteredTerms.map((term) => (
                        <TermCard key={term.term} term={term} />
                      ))}
                    </div>
                  )}
                </ScrollArea.Viewport>
                
                <ScrollArea.Scrollbar
                  className="flex select-none touch-none p-0.5 bg-slate-800 transition-colors duration-[160ms] ease-out hover:bg-slate-700 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
                  orientation="vertical"
                >
                  <ScrollArea.Thumb className="flex-1 bg-slate-600 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
                </ScrollArea.Scrollbar>
              </ScrollArea.Root>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

// Individual term card component
function TermCard({ term }: { term: MiningTerm }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="text-lg font-semibold text-white">{term.term}</h4>
            <span 
              className={`
                px-2 py-0.5 rounded-full text-xs border capitalize
                ${categoryColors[term.category as keyof typeof categoryColors]}
              `}
            >
              {categoryIcons[term.category as keyof typeof categoryIcons]} {term.category}
            </span>
          </div>
          
          <p className="text-sm text-gray-300 leading-relaxed">
            {term.definition}
          </p>
          
          {/* Additional Details */}
          {(term.example || term.unit || term.relatedTerms) && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-3 flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ChevronRight 
                className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
              />
              {isExpanded ? 'Hide' : 'Show'} details
            </button>
          )}
          
          {isExpanded && (
            <div className="mt-3 space-y-2 pl-4 border-l-2 border-slate-700">
              {term.example && (
                <div>
                  <p className="text-xs text-gray-400 font-medium">Example:</p>
                  <p className="text-xs text-gray-300 italic">{term.example}</p>
                </div>
              )}
              
              {term.unit && (
                <div>
                  <p className="text-xs text-gray-400 font-medium">Unit:</p>
                  <code className="text-xs text-blue-400 bg-slate-900 px-2 py-0.5 rounded">
                    {term.unit}
                  </code>
                </div>
              )}
              
              {term.relatedTerms && term.relatedTerms.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 font-medium">Related Terms:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {term.relatedTerms.map(related => (
                      <span 
                        key={related}
                        className="text-xs px-2 py-0.5 bg-slate-700 text-gray-300 rounded"
                      >
                        {related}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}