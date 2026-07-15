import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, Phone, HelpCircle } from 'lucide-react';
import { OFFICE_CONTACTS } from '../data/travelData';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAssistantModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I am your AI Travel Specialist. Planning a trip to India? Let me know your origin, target dates, or class preferences, and I'll recommend the best route strategies and phone-exclusive airline deals!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setHasNewMessage(false);
    }
  }, [isOpen]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Show a notification animation after 15 seconds to engage users
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setHasNewMessage(true);
      }
    }, 15000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Append user message
    const updatedMessages = [...messages, { role: 'user', content: userMessage } as Message];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Connection failed.');
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: "I'm having a brief connection delay. To speak with our live expert travel coordinators, please call us toll-free at 1-800-413-3932 or click the WhatsApp button!" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 font-sans">
      {/* Floating launcher button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center border border-blue-500/30"
          aria-label="Open AI Travel Assistant"
        >
          <MessageSquare className="w-6 h-6" />
          
          {/* Unread dot notification */}
          {hasNewMessage && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-500 text-[9px] text-white font-extrabold justify-center items-center">1</span>
            </span>
          )}
        </button>
      )}

      {/* Assistant Window */}
      {isOpen && (
        <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-[320px] sm:w-[380px] h-[480px] flex flex-col overflow-hidden shadow-2xl relative">
          
          {/* Header */}
          <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-500/10 p-2 rounded-full border border-blue-500/20">
                <Bot className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold tracking-tight">AI Travel Specialist</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Online & Active</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-slate-800 rounded-md transition-colors text-slate-400 hover:text-white"
              aria-label="Close Assistant Window"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick FAQ info block */}
          <div className="bg-blue-950/20 border-b border-slate-800 p-2 text-[10px] text-slate-400 text-center flex items-center justify-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>Securing unpublished, phone-exclusive airline pricing.</span>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/60'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {/* Typing Loader */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 border border-slate-700/60 text-slate-400 rounded-2xl rounded-tl-none px-4 py-3 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Action Footer */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask about flights, luggage, or routes..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-blue-500 placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-xl disabled:opacity-40 transition-colors cursor-pointer"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Fallback Direct Call Banner */}
          <div className="bg-slate-950 px-3 pb-2 text-[10px] text-center flex justify-between items-center border-t border-slate-900">
            <span className="text-slate-500">Need immediate live help?</span>
            <a 
              href={`tel:${OFFICE_CONTACTS.tollFree}`}
              className="text-orange-400 hover:underline font-mono font-bold flex items-center gap-0.5"
            >
              <Phone className="w-3 h-3" /> {OFFICE_CONTACTS.tollFree}
            </a>
          </div>

        </div>
      )}
    </div>
  );
}
