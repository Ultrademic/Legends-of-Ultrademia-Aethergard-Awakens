import React, { useState, useEffect } from 'react';
import { AlertCircle, Trophy, Scroll, Check, Sparkles, Megaphone } from 'lucide-react';

interface Toast {
  id: number;
  text: string;
  type: string;
}

export const ToastOverlay: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handleMessage = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (['level_up', 'quest', 'error', 'success', 'warning', 'SYSTEM'].includes(detail.type)) {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, text: detail.text, type: detail.type }]);
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
      }
    };

    window.addEventListener('UI_SYSTEM_MESSAGE', handleMessage);
    return () => window.removeEventListener('UI_SYSTEM_MESSAGE', handleMessage);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="absolute top-24 left-1/2 -translate-x-1/2 flex flex-col gap-2 pointer-events-none z-[100] w-auto max-w-lg items-center">
      {toasts.map(t => (
        <div key={t.id} className={`
          flex items-center gap-3 px-6 py-3 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.5)] border backdrop-blur-md animate-[slideIn_0.3s_ease-out]
          ${t.type === 'error' ? 'bg-red-950/90 border-red-500 text-red-100' : 
            t.type === 'level_up' ? 'bg-yellow-900/90 border-yellow-400 text-yellow-100 scale-110 shadow-[0_0_30px_rgba(234,179,8,0.4)]' :
            t.type === 'quest' ? 'bg-pink-900/90 border-pink-400 text-pink-100' :
            t.type === 'warning' ? 'bg-orange-900/90 border-orange-400 text-orange-100' :
            t.type === 'SYSTEM' ? 'bg-gradient-to-r from-red-900 to-red-800 border-red-400 text-white font-mono uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.5)]' :
            'bg-green-900/90 border-green-400 text-green-100'}
        `}>
          {t.type === 'error' && <AlertCircle className="shrink-0" />}
          {t.type === 'level_up' && <Trophy className="text-yellow-400 shrink-0" size={28} />}
          {t.type === 'quest' && <Scroll className="text-pink-400 shrink-0" />}
          {t.type === 'success' && <Check className="text-green-400 shrink-0" />}
          {t.type === 'warning' && <AlertCircle className="text-orange-400 shrink-0" />}
          {t.type === 'SYSTEM' && <Megaphone className="text-white shrink-0 animate-pulse" size={20} />}
          
          <span className="font-bold font-fantasy tracking-wide text-lg drop-shadow-md text-center leading-tight">
            {t.text}
          </span>
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-20px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};