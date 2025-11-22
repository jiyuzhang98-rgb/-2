import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Sparkles, Loader2, Bot } from 'lucide-react';
import { ChatMessage } from '../types';
import { generateChatResponse } from '../services/geminiService';

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '您好！我是KANO智能助手。关于我们的产品系列，有什么可以帮您的吗？', timestamp: Date.now() }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
        scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Prepare history for API (exclude timestamp)
    const history = messages.map(m => ({ role: m.role, text: m.text }));
    
    const responseText = await generateChatResponse(history, userMsg.text);
    
    const modelMsg: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  return (
    <>
        {/* Trigger Button */}
        <button
            onClick={() => setIsOpen(true)}
            className={`fixed bottom-6 right-6 z-40 bg-slate-900 hover:bg-black text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        >
            <Sparkles size={20} />
            <span className="font-medium pr-1 hidden md:inline text-sm">AI 助手</span>
        </button>

        {/* Chat Window */}
        <div className={`fixed bottom-6 right-6 z-50 w-[90vw] sm:w-[360px] h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0 pointer-events-none'}`}>
            
            {/* Header */}
            <div className="bg-slate-900 p-4 rounded-t-2xl flex justify-between items-center">
                <div className="flex items-center gap-2 text-white">
                    <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-md">
                        <Bot size={18} />
                    </div>
                    <div>
                        <h3 className="font-bold leading-none text-sm">KANO Assistant</h3>
                        <span className="text-[10px] text-slate-400 opacity-80">智能导购</span>
                    </div>
                </div>
                <button 
                    onClick={() => setIsOpen(false)}
                    className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div 
                            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                                msg.role === 'user' 
                                ? 'bg-slate-900 text-white rounded-br-none' 
                                : 'bg-white text-slate-700 border border-slate-200 shadow-sm rounded-bl-none'
                            }`}
                        >
                            {msg.text.split('\n').map((line, i) => (
                                <React.Fragment key={i}>
                                    {line}
                                    {i !== msg.text.split('\n').length - 1 && <br />}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                         <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-slate-200 shadow-sm flex items-center gap-2">
                            <Loader2 size={14} className="animate-spin text-slate-900" />
                            <span className="text-xs text-slate-400">正在思考...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-100 rounded-b-2xl">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="输入您的问题..."
                        className="w-full bg-slate-100 text-slate-800 placeholder:text-slate-400 rounded-full py-2.5 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm"
                    />
                    <button 
                        type="submit" 
                        disabled={!input.trim() || isLoading}
                        className="absolute right-1.5 p-2 bg-slate-900 text-white rounded-full hover:bg-black disabled:opacity-50 disabled:hover:bg-slate-900 transition-colors"
                    >
                        <Send size={14} />
                    </button>
                </div>
            </form>
        </div>
    </>
  );
};

export default AIChat;