import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ChatMessageType } from '../../types';
import { generateNPCResponse } from '../../services/geminiService';
import { Send, MessageSquare, AlertTriangle, Scroll, Sparkles, Sword } from 'lucide-react';

export const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'System', text: 'Welcome to Ultrademic RPG.', type: 'system', timestamp: Date.now() },
    { id: '2', sender: 'Valakor', text: 'Greetings, traveler. Ask me about this world.', type: 'general', timestamp: Date.now() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleSystemMessage = (e: Event) => {
        const customEvent = e as CustomEvent;
        if (customEvent.detail && customEvent.detail.text) {
             const sysMsg: ChatMessage = {
                id: Date.now().toString() + Math.random(),
                sender: 'System',
                text: customEvent.detail.text,
                type: (customEvent.detail.type as ChatMessageType) || 'system',
                timestamp: Date.now()
             };
             setMessages(prev => {
               const updated = [...prev, sysMsg];
               if (updated.length > 50) return updated.slice(updated.length - 50);
               return updated;
             });
        }
    };

    window.addEventListener('UI_SYSTEM_MESSAGE', handleSystemMessage);
    return () => window.removeEventListener('UI_SYSTEM_MESSAGE', handleSystemMessage);
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'You',
      text: inputValue,
      type: 'general',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    const responseText = await generateNPCResponse(userMsg.text);

    const npcMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'Valakor',
      text: responseText,
      type: 'general',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, npcMsg]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  const getMessageStyle = (type: ChatMessageType) => {
    switch(type) {
      case 'system': return { color: 'text-yellow-400', bg: '' };
      case 'SYSTEM': return { color: 'text-red-100 font-bold uppercase tracking-widest', bg: 'bg-gradient-to-r from-red-950/90 to-transparent border-l-2 border-red-500' };
      case 'info': return { color: 'text-yellow-200', bg: '' };
      case 'warning': return { color: 'text-orange-400 font-bold', bg: 'bg-orange-900/10' };
      case 'success': return { color: 'text-green-400 font-bold', bg: '' };
      case 'error': return { color: 'text-red-500 font-bold', bg: 'bg-red-900/10' };
      case 'loot': return { color: 'text-amber-300 font-bold', bg: '' };
      case 'experience': return { color: 'text-blue-300', bg: '' };
      case 'level_up': return { color: 'text-yellow-300 font-bold animate-pulse', bg: 'bg-yellow-900/20 border-l-2 border-yellow-500' };
      case 'combat': return { color: 'text-red-300 opacity-80', bg: '' };
      case 'quest': return { color: 'text-sky-300 font-bold', bg: 'bg-blue-900/20 border-l-2 border-blue-500' };
      case 'party': return { color: 'text-green-300', bg: '' };
      case 'whisper': return { color: 'text-purple-400', bg: '' };
      case 'hero': return { color: 'text-blue-400', bg: '' };
      default: return { color: 'text-gray-200', bg: '' };
    }
  };

  const getTypeIcon = (type: ChatMessageType) => {
      switch(type) {
          case 'SYSTEM': return <AlertTriangle size={12} className="text-red-500 mt-0.5 shrink-0" />;
          case 'error': return <AlertTriangle size={12} className="text-red-500 mt-0.5 shrink-0" />;
          case 'quest': return <Scroll size={12} className="text-sky-400 mt-0.5 shrink-0" />;
          case 'loot': return <Sparkles size={12} className="text-amber-400 mt-0.5 shrink-0" />;
          case 'combat': return <Sword size={10} className="text-red-400 mt-1 shrink-0 opacity-60" />;
          default: return null;
      }
  };

  return (
    <div className="pointer-events-auto absolute bottom-4 left-4 w-96 h-64 bg-black/70 border border-gray-600 rounded-lg flex flex-col backdrop-blur-md shadow-lg font-sans text-sm z-40">
      <div className="flex bg-black/40 border-b border-gray-700 p-1 gap-2 text-xs">
        <button className="px-2 py-1 bg-gray-700/50 rounded text-gray-200 hover:text-white">All</button>
        <button className="px-2 py-1 hover:bg-gray-700/30 rounded text-gray-400 hover:text-white">Party</button>
        <button className="px-2 py-1 hover:bg-gray-700/30 rounded text-gray-400 hover:text-white">Clan</button>
        <button className="px-2 py-1 hover:bg-gray-700/30 rounded text-gray-400 hover:text-white">Trade</button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {messages.map(msg => {
          const style = getMessageStyle(msg.type);
          
          return (
            <div 
              key={msg.id} 
              className={`leading-tight break-words flex items-start gap-1.5 px-1 py-0.5 rounded-sm ${style.bg}`}
            >
              {getTypeIcon(msg.type)}
              <div className="text-xs font-mono">
                {msg.sender !== 'System' && msg.sender !== 'You' && (
                    <span className="text-gray-400 font-bold mr-1">[{msg.sender}]:</span>
                )}
                {msg.sender === 'You' && (
                    <span className="text-gray-400 font-bold mr-1">You:</span>
                )}
                <span className={style.color}>
                  {msg.text}
                </span>
              </div>
            </div>
          );
        })}
        {isTyping && <div className="text-gray-500 italic text-xs ml-2 mt-1">Valakor is thinking...</div>}
      </div>

      <div className="p-2 border-t border-gray-700 flex gap-2">
        <div className="bg-gray-900 border border-gray-600 rounded px-2 flex items-center justify-center">
            <MessageSquare size={14} className="text-gray-400" />
        </div>
        <input 
          className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 text-sm"
          placeholder="Say something..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSend} className="text-yellow-500 hover:text-yellow-400">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};