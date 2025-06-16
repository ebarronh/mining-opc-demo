'use client';

import { memo, useMemo } from 'react';

interface SyntaxHighlighterProps {
  code: string;
  language: string;
  className?: string;
}

// Simple syntax highlighter for common languages
const highlightCode = (code: string, language: string): string => {
  if (typeof window === 'undefined') {
    return code; // Return plain code on server
  }

  const patterns: Record<string, Array<{ pattern: RegExp; replacement: string }>> = {
    javascript: [
      { pattern: /\b(const|let|var|function|async|await|return|if|else|for|while|try|catch|finally|throw|new|class|extends|import|export|from|default)\b/g, replacement: '<span class="text-purple-400">$1</span>' },
      { pattern: /\b(true|false|null|undefined)\b/g, replacement: '<span class="text-orange-400">$1</span>' },
      { pattern: /"([^"\\]|\\.)*"/g, replacement: '<span class="text-green-400">$&</span>' },
      { pattern: /'([^'\\]|\\.)*'/g, replacement: '<span class="text-green-400">$&</span>' },
      { pattern: /`([^`\\]|\\.)*`/g, replacement: '<span class="text-green-400">$&</span>' },
      { pattern: /\/\/.*$/gm, replacement: '<span class="text-gray-500">$&</span>' },
      { pattern: /\/\*[\s\S]*?\*\//g, replacement: '<span class="text-gray-500">$&</span>' },
      { pattern: /\b\d+\.?\d*\b/g, replacement: '<span class="text-yellow-400">$&</span>' },
    ],
    python: [
      { pattern: /\b(def|class|import|from|as|if|elif|else|for|while|try|except|finally|with|return|yield|lambda|global|nonlocal|pass|break|continue|and|or|not|in|is)\b/g, replacement: '<span class="text-purple-400">$1</span>' },
      { pattern: /\b(True|False|None)\b/g, replacement: '<span class="text-orange-400">$1</span>' },
      { pattern: /"([^"\\]|\\.)*"/g, replacement: '<span class="text-green-400">$&</span>' },
      { pattern: /'([^'\\]|\\.)*'/g, replacement: '<span class="text-green-400">$&</span>' },
      { pattern: /#.*$/gm, replacement: '<span class="text-gray-500">$&</span>' },
      { pattern: /\b\d+\.?\d*\b/g, replacement: '<span class="text-yellow-400">$&</span>' },
    ],
    bash: [
      { pattern: /\b(echo|ls|cd|mkdir|rm|cp|mv|grep|find|awk|sed|cat|head|tail|sort|uniq|wc|chmod|chown|ps|kill|nohup|screen|tmux)\b/g, replacement: '<span class="text-purple-400">$1</span>' },
      { pattern: /"([^"\\]|\\.)*"/g, replacement: '<span class="text-green-400">$&</span>' },
      { pattern: /'([^'\\]|\\.)*'/g, replacement: '<span class="text-green-400">$&</span>' },
      { pattern: /#.*$/gm, replacement: '<span class="text-gray-500">$&</span>' },
      { pattern: /\$\w+/g, replacement: '<span class="text-yellow-400">$&</span>' },
    ],
    json: [
      { pattern: /"([^"\\]|\\.)*":/g, replacement: '<span class="text-blue-400">$&</span>' },
      { pattern: /:\s*"([^"\\]|\\.)*"/g, replacement: ': <span class="text-green-400">"$1"</span>' },
      { pattern: /\b(true|false|null)\b/g, replacement: '<span class="text-orange-400">$1</span>' },
      { pattern: /\b\d+\.?\d*\b/g, replacement: '<span class="text-yellow-400">$&</span>' },
    ]
  };

  const languagePatterns = patterns[language.toLowerCase()] || [];
  
  let highlightedCode = code;
  languagePatterns.forEach(({ pattern, replacement }) => {
    highlightedCode = highlightedCode.replace(pattern, replacement);
  });

  return highlightedCode;
};

function SyntaxHighlighter({ code, language, className = '' }: SyntaxHighlighterProps) {
  const highlightedCode = useMemo(() => highlightCode(code, language), [code, language]);
  
  return (
    <pre className={`text-sm overflow-x-auto text-slate-300 bg-slate-900 p-4 rounded-lg ${className}`}>
      <code 
        className="font-mono"
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
    </pre>
  );
}

export default memo(SyntaxHighlighter);