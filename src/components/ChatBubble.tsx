import React from 'react';

interface ChatBubbleProps {
  role: 'user' | 'ai';
  text: string;
  timestamp?: string;
}

export function ChatBubble({ role, text, timestamp }: ChatBubbleProps) {
  const isUser = role === 'user';

  // Basic Markdown-like formatter for a professional AI output look
  const formatText = (rawText: string) => {
    const lines = rawText.split('\n');
    return lines.map((line, idx) => {
      // Headers
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-sm font-extrabold text-slate-800 mt-2 mb-1 first:mt-0">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} className="text-base font-black text-slate-900 mt-3 mb-1 first:mt-0">{line.replace('## ', '')}</h3>;
      }
      // Bullet list
      if (line.startsWith('- ')) {
        return (
          <ul key={idx} className="list-disc pl-4 text-xs font-semibold text-slate-700 space-y-0.5 my-1">
            <li>{parseInline(line.replace('- ', ''))}</li>
          </ul>
        );
      }
      // Numbered list
      if (/^\d+\.\s/.test(line)) {
        const content = line.replace(/^\d+\.\s/, '');
        return (
          <ol key={idx} className="list-decimal pl-4 text-xs font-semibold text-slate-700 space-y-0.5 my-1">
            <li>{parseInline(content)}</li>
          </ol>
        );
      }
      // Regular line
      return <p key={idx} className="text-xs leading-relaxed mb-1.5 last:mb-0 font-medium text-slate-700">{parseInline(line)}</p>;
    });
  };

  // Helper to parse bold (**text**) and code ($code$ or `code`)
  const parseInline = (lineContent: string) => {
    let parts: React.ReactNode[] = [lineContent];
    
    // Bold parser
    const boldRegex = /\*\*(.*?)\*\*/g;
    let match;
    
    if (lineContent.includes('**')) {
      const newParts: React.ReactNode[] = [];
      let lastIndex = 0;
      
      while ((match = boldRegex.exec(lineContent)) !== null) {
        // text before bold
        if (match.index > lastIndex) {
          newParts.push(lineContent.substring(lastIndex, match.index));
        }
        // bold element
        newParts.push(<strong key={match.index} className="font-extrabold text-slate-900">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      
      if (lastIndex < lineContent.length) {
        newParts.push(lineContent.substring(lastIndex));
      }
      parts = newParts;
    }

    // Inline Math / Code formatting ($formula$ or `code`)
    // Let's replace wrapped formulas or variables with code tags
    return parts.map((part, index) => {
      if (typeof part !== 'string') return part;
      
      const mathRegex = /\$(.*?)\$/g;
      if (part.includes('$')) {
        const subParts: React.ReactNode[] = [];
        let lastIdx = 0;
        let m;
        
        while ((m = mathRegex.exec(part)) !== null) {
          if (m.index > lastIdx) {
            subParts.push(part.substring(lastIdx, m.index));
          }
          subParts.push(
            <code key={m.index} className="bg-slate-100 px-1 py-0.5 rounded text-primary font-mono text-[11px] font-bold">
              {m[1]}
            </code>
          );
          lastIdx = mathRegex.lastIndex;
        }
        
        if (lastIdx < part.length) {
          subParts.push(part.substring(lastIdx));
        }
        return <span key={index}>{subParts}</span>;
      }
      
      return part;
    });
  };

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-1`}>
      <div
        role="text"
        aria-label={isUser ? 'User message' : 'AI message'}
        className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-[0_2px_10px_rgba(0,0,0,0.01)] transition-all ${
          isUser 
            ? 'bg-primary text-white' 
            : 'bg-white border border-slate-150 text-slate-800'
        }`}
      >
        {isUser ? (
          <p className="text-xs font-semibold leading-relaxed">{text}</p>
        ) : (
          <div className="space-y-1">{formatText(text)}</div>
        )}
      </div>
      
      {timestamp && (
        <span className="text-[9px] font-bold text-slate-400 mt-1 px-1.5 uppercase">
          {timestamp}
        </span>
      )}
    </div>
  );
}
