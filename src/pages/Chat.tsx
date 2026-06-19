import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Send, Bot, User, HelpCircle } from 'lucide-react';
import { Card } from '../components/Card';
import { ChatBubble } from '../components/ChatBubble';
import { ChatInput } from '../components/ChatInput';
import { useApp } from '../lib/AppContext';

const SUGGESTIONS = [
  { label: 'Help me with Calculus', query: 'Help me with Calculus foundations' },
  { label: 'Explain Eigenvectors', query: 'Explain eigenvectors and eigenvalues' },
  { label: 'Quiz me on Genetics', query: 'Quiz me on Genetics and DNA Sequencing' },
  { label: 'Data Structures advice', query: 'Graph traversal algorithms BFS/DFS' }
];

export default function Chat() {
  const { messages, sendMessage, profile } = useApp();
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    // 1. Instantly trigger state update in context (adds user message)
    sendMessage(text);
    
    // 2. Turn on typing indicator locally
    setIsTyping(true);
    
    // 3. Clear indicator after 1000ms when AI response lands
    setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  return (
    <Card className="flex flex-col h-[76vh] bg-white dark:bg-zinc-900/40 border-slate-100 dark:border-zinc-800 p-0 overflow-hidden rounded-3xl relative">
      {/* Header Info */}
      <div className="bg-slate-50/80 dark:bg-zinc-950/40 backdrop-blur border-b border-slate-100 dark:border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/20 flex items-center justify-center text-primary border border-purple-100 dark:border-purple-900/30">
            <Bot className="h-5.5 w-5.5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
              <span>CogniSphere AI Tutor</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Level {profile.level} Math & Science Specialist</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-zinc-400">
          <Sparkles className="h-4 w-4 text-purple-500 fill-purple-100 dark:fill-purple-950/10 animate-pulse" />
          <span>Active Practice Mode</span>
        </div>
      </div>

      {/* Suggestion Chips */}
      <div className="px-6 py-3 bg-white dark:bg-zinc-900/20 border-b border-slate-50 dark:border-zinc-850 flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
        <div className="flex gap-2 shrink-0">
          {SUGGESTIONS.map((s, index) => (
            <button
              key={index}
              onClick={() => handleSend(s.query)}
              className="px-3 py-1.5 rounded-full border border-slate-200 dark:border-zinc-800 hover:border-primary dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/20 text-[11px] font-bold text-slate-600 dark:text-zinc-300 hover:text-primary dark:hover:text-purple-300 transition-all flex items-center gap-1 cursor-pointer select-none bg-white dark:bg-zinc-900/60"
            >
              <HelpCircle className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-zinc-500 group-hover:text-primary" />
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages View */}
      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto px-6 py-4 space-y-4 bg-slate-50/10 dark:bg-black/20" 
        role="log" 
        aria-live="polite"
      >
        {messages.map(m => (
          <ChatBubble 
            key={m.id} 
            role={m.role} 
            text={m.text} 
            timestamp={m.timestamp}
          />
        ))}

        {/* Loading/Typing Indicator */}
        {isTyping && (
          <div className="flex items-start gap-1 mb-1 animate-pulse">
            <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-white dark:bg-zinc-900 border border-slate-150 dark:border-zinc-800 text-slate-400 dark:text-zinc-500 text-xs font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-zinc-650 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-zinc-650 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-zinc-650 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              <span className="ml-1 text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500">AI is drafting answer...</span>
            </div>
          </div>
        )}
      </div>

      {/* Message Input Footer */}
      <div className="p-4 bg-white dark:bg-zinc-900/40 border-t border-slate-100 dark:border-zinc-800">
        <ChatInput onSend={handleSend} />
      </div>
    </Card>
  );
}
