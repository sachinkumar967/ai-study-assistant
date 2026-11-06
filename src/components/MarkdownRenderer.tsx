import React, { useState } from 'react';
import { Copy, Check, Terminal, Lightbulb, AlertTriangle, CheckCircle2, Bookmark } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose-content space-y-3 leading-relaxed text-slate-800 dark:text-slate-100 text-[15px]">
      {renderFormattedBlocks(content)}
    </div>
  );
};

function renderFormattedBlocks(rawText: string): React.ReactNode[] {
  // Split content by code blocks first
  const parts = rawText.split(/(```[\s\S]*?```)/g);

  return parts.map((part, index) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      return <CodeBlock key={index} rawCodeBlock={part} />;
    }
    return <TextBlock key={index} text={part} />;
  });
}

const CodeBlock: React.FC<{ rawCodeBlock: string }> = ({ rawCodeBlock }) => {
  const [copied, setCopied] = useState(false);
  const match = rawCodeBlock.match(/```([a-zA-Z0-9_-]*)\n?([\s\S]*?)```/);
  const language = match?.[1] || 'code';
  const code = match?.[2] || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-slate-700/60 bg-slate-900/90 shadow-lg text-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-950/80 border-b border-slate-800 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span className="uppercase tracking-wider font-semibold text-indigo-300">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-all text-xs cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto font-mono text-xs md:text-sm text-slate-200 leading-relaxed scrollbar-thin">
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
};

const TextBlock: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushList = () => {
    if (currentList) {
      if (currentList.type === 'ul') {
        elements.push(
          <ul key={`list-${elements.length}`} className="my-2 space-y-1.5 pl-5 list-disc marker:text-indigo-500">
            {currentList.items.map((item, i) => (
              <li key={i}>{formatInline(item)}</li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={`list-${elements.length}`} className="my-2 space-y-1.5 pl-5 list-decimal marker:text-indigo-400 font-medium">
            {currentList.items.map((item, i) => (
              <li key={i}>{formatInline(item)}</li>
            ))}
          </ol>
        );
      }
      currentList = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    // Step-by-Step doubt solver headers or Section Callouts
    if (trimmed.startsWith('### 🎯') || trimmed.includes('Problem Breakdown') || trimmed.includes('Sawal Kya Puch Raha')) {
      flushList();
      const title = trimmed.replace(/^###\s*🎯?\s*/, '');
      elements.push(
        <div key={i} className="mt-4 mb-2 flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-base border-b border-blue-500/20 pb-1">
          <span className="p-1 rounded-md bg-blue-500/10 text-blue-500">🎯</span>
          <span>{title || 'Sawal Kya Puch Raha Hai?'}</span>
        </div>
      );
      continue;
    }

    if (trimmed.startsWith('### 🔑') || trimmed.includes('Core Principles') || trimmed.includes('Kaunsa Formula')) {
      flushList();
      const title = trimmed.replace(/^###\s*🔑?\s*/, '');
      elements.push(
        <div key={i} className="mt-4 mb-2 flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-base border-b border-purple-500/20 pb-1">
          <span className="p-1 rounded-md bg-purple-500/10 text-purple-500">🔑</span>
          <span>{title || 'Kaunsa Formula / Rule Lagega?'}</span>
        </div>
      );
      continue;
    }

    if (trimmed.startsWith('### 📝') || trimmed.includes('Step-by-Step') || trimmed.includes('Hal')) {
      flushList();
      const title = trimmed.replace(/^###\s*📝?\s*/, '');
      elements.push(
        <div key={i} className="mt-4 mb-2 flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-base border-b border-indigo-500/20 pb-1">
          <span className="p-1 rounded-md bg-indigo-500/10 text-indigo-500">📝</span>
          <span>{title || 'Step-by-Step Hal (Solution)'}</span>
        </div>
      );
      continue;
    }

    if (trimmed.startsWith('### 💡') || trimmed.includes('Final Result') || trimmed.includes('Final Answer') || trimmed.includes('Sahi Uttar')) {
      flushList();
      const title = trimmed.replace(/^###\s*💡?\s*/, '');
      elements.push(
        <div key={i} className="mt-4 mb-2 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-base border-b border-emerald-500/20 pb-1">
          <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-500">💡</span>
          <span>{title || 'Final Answer (Sahi Uttar)'}</span>
        </div>
      );
      continue;
    }

    if (trimmed.startsWith('### 🌟') || trimmed.startsWith('### ⚠️') || trimmed.includes('Common Mistakes') || trimmed.includes('Pro-Tip') || trimmed.includes('Asaan Trick') || trimmed.includes('Study Tip')) {
      flushList();
      const title = trimmed.replace(/^###\s*[🌟⚠️💡]?\s*/, '');
      elements.push(
        <div key={i} className="mt-4 mb-2 flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-base border-b border-amber-500/20 pb-1">
          <span className="p-1 rounded-md bg-amber-500/10 text-amber-500">🌟</span>
          <span>{title || 'Asaan Trick / Pro-Tip'}</span>
        </div>
      );
      continue;
    }

    // Generic H3
    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={i} className="text-base font-bold text-indigo-600 dark:text-indigo-300 mt-3 mb-1">
          {formatInline(trimmed.replace('### ', ''))}
        </h3>
      );
      continue;
    }

    // H2
    if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={i} className="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-1">
          {formatInline(trimmed.replace('## ', ''))}
        </h2>
      );
      continue;
    }

    // Unordered bullet list
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const itemText = trimmed.substring(2);
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [itemText] };
      } else {
        currentList.items.push(itemText);
      }
      continue;
    }

    // Numbered list (e.g. "1. " or "Step 1:")
    const numMatch = trimmed.match(/^(\d+[\.\)]|\bStep\s+\d+:?)\s+(.*)$/i);
    if (numMatch) {
      const itemText = trimmed;
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [itemText] };
      } else {
        currentList.items.push(itemText);
      }
      continue;
    }

    // Normal paragraph
    flushList();
    elements.push(
      <p key={i} className="my-1.5 leading-relaxed">
        {formatInline(trimmed)}
      </p>
    );
  }

  flushList();
  return <>{elements}</>;
};

function formatInline(text: string): React.ReactNode {
  // Regex for bold, inline code, and math symbols
  // Split on bold **bold**, math $$math$$ or $math$, inline `code`
  const tokens = text.split(/(\*\*.*?\*\*|\$\$.*?\$\$|\$.*?\$|`.*?`)/g);

  return tokens.map((token, idx) => {
    if (token.startsWith('**') && token.endsWith('**') && token.length >= 4) {
      return (
        <strong key={idx} className="font-semibold text-slate-900 dark:text-white">
          {token.slice(2, -2)}
        </strong>
      );
    }

    if (token.startsWith('`') && token.endsWith('`') && token.length >= 2) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800 font-mono text-xs md:text-sm text-indigo-600 dark:text-indigo-300 font-medium border border-slate-300/60 dark:border-slate-700"
        >
          {token.slice(1, -1)}
        </code>
      );
    }

    // Display Math notation $$...$$
    if (token.startsWith('$$') && token.endsWith('$$') && token.length >= 4) {
      const mathStr = token.slice(2, -2);
      return (
        <span
          key={idx}
          className="inline-block my-1 px-3 py-1 rounded-lg bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 font-mono text-indigo-700 dark:text-indigo-300 text-sm font-semibold tracking-wide"
        >
          {cleanMathDisplay(mathStr)}
        </span>
      );
    }

    // Inline Math notation $...$
    if (token.startsWith('$') && token.endsWith('$') && token.length >= 2) {
      const mathStr = token.slice(1, -1);
      return (
        <span
          key={idx}
          className="inline-block px-1.5 py-0.5 rounded bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-mono text-xs md:text-sm font-medium border border-blue-200/60 dark:border-blue-800/50"
        >
          {cleanMathDisplay(mathStr)}
        </span>
      );
    }

    return token;
  });
}

// Clean common LaTeX representations into readable format if needed
function cleanMathDisplay(math: string): string {
  return math
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 / $2)')
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    .replace(/\\pm/g, '±')
    .replace(/\\cdot/g, '·')
    .replace(/\\times/g, '×')
    .replace(/\\leq/g, '≤')
    .replace(/\\geq/g, '≥')
    .replace(/\\neq/g, '≠')
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\theta/g, 'θ')
    .replace(/\\pi/g, 'π')
    .replace(/\\mathbf\{([^}]+)\}/g, '$1')
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\quad/g, '  ')
    .replace(/\\/g, '');
}
