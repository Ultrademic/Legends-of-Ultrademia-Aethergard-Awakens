import React from 'react';
import { Quest } from '../../types';
import { X, Scroll, Trophy, Coins, ChevronRight, CheckCircle, Package, FlaskConical } from 'lucide-react';

interface QuestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  npcName: string;
  questData: Quest | null;
  onAccept: (id: string) => void;
  onComplete: (id: string) => void;
  dialogueText: string;
}

const REWARD_ICONS: Record<string, React.ReactNode> = {
    "flask": <FlaskConical size={14} className="text-red-400" />,
    "scroll": <Scroll size={14} className="text-yellow-400" />,
    "default": <Package size={14} className="text-orange-400" />
};

export const QuestDialog: React.FC<QuestDialogProps> = ({ 
    isOpen, onClose, npcName, questData, onAccept, onComplete, dialogueText 
}) => {
  if (!isOpen || !questData) return null;

  const isStarted = questData.started;
  const isReady = questData.currentKills >= questData.requiredKills && isStarted;
  const isCompleted = questData.completed;

  const xp = questData.rewards?.xp ?? 0;
  const adena = questData.rewards?.adena ?? 0;
  const items = questData.rewards?.items ?? [];

  return (
    <div className="pointer-events-auto fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
      <div className="w-[600px] bg-black/95 border-2 border-yellow-800 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col font-sans relative overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-yellow-900 via-yellow-600 to-yellow-900 border-b border-yellow-500"></div>
        <div className="flex items-center justify-between p-6 pb-2">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-yellow-600 bg-gray-900 flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                    <span className="text-2xl">🧙‍♂️</span>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-yellow-500 font-fantasy tracking-wide">{npcName}</h2>
                    <span className="text-gray-500 text-xs uppercase font-bold tracking-widest">Village Elder</span>
                </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                <X size={24} />
            </button>
        </div>

        <div className="px-8 py-4">
            <div className="bg-gray-900/50 p-4 rounded border-l-2 border-yellow-700/50 mb-6 min-h-[80px]">
                <p className="text-gray-300 italic text-sm leading-relaxed">
                    "{dialogueText}"
                </p>
            </div>

            {!isCompleted && (
                <div className="border border-gray-700 bg-gray-900/30 rounded p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Scroll size={16} className="text-yellow-600" />
                        <h3 className="text-yellow-100 font-bold text-lg">{questData.name}</h3>
                    </div>
                    <p className="text-gray-400 text-xs mb-4">{questData.description}</p>
                    <div className="mb-4">
                        <div className="text-[10px] uppercase font-bold text-gray-500 mb-1">Objectives</div>
                        <div className="flex justify-between items-center bg-black/40 p-2 rounded border border-gray-800">
                            <span className="text-gray-300 text-sm">Slay Gladeon Wolves</span>
                            <span className={`font-mono font-bold ${isReady ? 'text-green-400' : 'text-gray-400'}`}>
                                {questData.currentKills} / {questData.requiredKills}
                            </span>
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] uppercase font-bold text-gray-500 mb-1">Rewards</div>
                        <div className="flex flex-wrap gap-2">
                            {xp > 0 && (
                                <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded border border-gray-800">
                                    <Trophy size={14} className="text-blue-400" />
                                    <span className="text-blue-100 text-xs font-bold">{xp} XP</span>
                                </div>
                            )}
                            {adena > 0 && (
                                <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded border border-gray-800">
                                    <Coins size={14} className="text-yellow-400" />
                                    <span className="text-yellow-100 text-xs font-bold">{adena} Adena</span>
                                </div>
                            )}
                            {items.map((item, i) => (
                                <div key={i} className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded border border-gray-800">
                                    {REWARD_ICONS[item.icon || 'default'] || REWARD_ICONS['default']}
                                    <span className="text-gray-200 text-xs font-bold">{item.count}x {item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            
            {isCompleted && (
                <div className="text-center py-8">
                    <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                    <h3 className="text-green-400 font-bold text-xl">Quest Completed</h3>
                    <p className="text-gray-500 text-sm">You have aided the village greatly.</p>
                </div>
            )}
        </div>

        <div className="p-6 pt-2 flex justify-end gap-3">
            {!isStarted && !isCompleted && (
                <button 
                    onClick={() => onAccept(questData.id)}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-700 hover:to-blue-500 text-white font-bold py-2 px-6 rounded border border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all transform hover:scale-105"
                >
                    <span>Accept Quest</span>
                    <ChevronRight size={16} />
                </button>
            )}

            {isStarted && !isReady && !isCompleted && (
                <button 
                    onClick={onClose}
                    className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-2 px-6 rounded border border-gray-600 transition-colors"
                >
                    I will return later
                </button>
            )}

            {isReady && !isCompleted && (
                <button 
                    onClick={() => onComplete(questData.id)}
                    className="flex items-center gap-2 bg-gradient-to-r from-yellow-700 to-yellow-500 hover:from-yellow-600 hover:to-yellow-400 text-white font-bold py-2 px-6 rounded border border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.5)] transition-all transform hover:scale-105 animate-pulse"
                >
                    <Trophy size={16} />
                    <span>Complete Quest</span>
                </button>
            )}
            
            {isCompleted && (
                <button 
                    onClick={onClose}
                    className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded border border-gray-600"
                >
                    Close
                </button>
            )}
        </div>
      </div>
    </div>
  );
};