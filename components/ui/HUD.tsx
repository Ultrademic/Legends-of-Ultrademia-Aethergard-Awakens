import React from 'react';
import { PlayerStats, SkillData } from '../../types';
import { Shield, Sword, Zap, Heart, Activity, Ghost, Flame, Coins, FlaskConical, Sparkles, Scroll } from 'lucide-react';

interface HUDProps {
  stats: PlayerStats;
}

const ICON_MAP: Record<string, React.ReactNode> = {
    "sword": <Sword size={24} className="text-yellow-100" />,
    "zap": <Zap size={24} className="text-cyan-100" />,
    "heart": <Heart size={24} className="text-pink-200" />,
    "shield": <Shield size={24} className="text-blue-100" />,
    "activity": <Activity size={24} className="text-green-100" />,
    "ghost": <Ghost size={24} className="text-purple-100" />,
    "default": <Flame size={24} className="text-gray-200" />
};

const ProgressBar: React.FC<{ current: number; max: number; color: string; label: string }> = ({ current, max, color, label }) => {
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));
  return (
    <div className="relative w-full h-4 bg-gray-900/90 border border-gray-600 rounded mb-1 overflow-hidden shadow-sm">
      <div 
        className={`h-full ${color} transition-all duration-300 ease-out`} 
        style={{ width: `${percentage}%` }}
      />
      <div className="absolute inset-0 flex items-center justify-between px-2 text-[10px] font-bold text-white shadow-black drop-shadow-md tracking-wider">
        <span className="opacity-90">{label}</span>
        <span>{Math.floor(current)} / {max}</span>
      </div>
    </div>
  );
};

export const HUD: React.FC<HUDProps> = ({ stats }) => {
  const handleSkillClick = (index: number) => {
      window.dispatchEvent(new CustomEvent('UI_TRIGGER_SKILL', { detail: { index } }));
  };
  const handleToggleSoulshot = () => {
      window.dispatchEvent(new CustomEvent('UI_TOGGLE_SHOT', { detail: { type: 'soulshot' } }));
  };
  const handleToggleSpiritshot = () => {
      window.dispatchEvent(new CustomEvent('UI_TOGGLE_SHOT', { detail: { type: 'spiritshot' } }));
  };
  const handleUsePotion = () => {
      window.dispatchEvent(new CustomEvent('UI_USE_POTION'));
  };
  const getSkillInSlot = (slotIndex: number): SkillData | undefined => {
      const skillId = stats.skills[slotIndex];
      if (!skillId) return undefined;
      return stats.skillDetails?.find(s => s.id === skillId);
  };
  const adena = stats.consumables?.adena ?? 0;
  const potions = stats.consumables?.healthPotions ?? 0;
  const soulshots = stats.consumables?.soulshots ?? 0;
  const spiritshots = stats.consumables?.spiritshots ?? 0;

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none p-4 flex flex-col justify-between select-none font-sans">
      <div className="pointer-events-auto w-80 bg-gradient-to-r from-black/90 to-transparent border-l-4 border-yellow-600 rounded-r-lg p-4 backdrop-blur-md shadow-lg">
        <div className="flex items-center mb-3">
          <div className="w-14 h-14 bg-gray-900 border border-yellow-700/50 rounded-lg mr-4 flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.15)] bg-gradient-to-br from-gray-800 to-black">
             <Shield className="text-yellow-500 w-8 h-8 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
          </div>
          <div>
            <h2 className="text-yellow-400 font-fantasy font-bold text-xl leading-none tracking-wide drop-shadow-md">{stats.name}</h2>
            <span className="text-gray-400 text-xs uppercase tracking-widest font-bold opacity-80">Lvl {stats.level} {stats.class}</span>
          </div>
        </div>
        <ProgressBar current={stats.cp} max={stats.maxCp} color="bg-gradient-to-r from-yellow-700 to-yellow-500" label="CP" />
        <ProgressBar current={stats.hp} max={stats.maxHp} color="bg-gradient-to-r from-red-800 to-red-600" label="HP" />
        <ProgressBar current={stats.mp} max={stats.maxMp} color="bg-gradient-to-r from-blue-700 to-blue-500" label="MP" />
      </div>

      <div className="absolute top-4 right-4 pointer-events-auto w-72 bg-black/70 border border-gray-700 rounded-lg p-3 backdrop-blur-sm opacity-90 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-red-400 font-bold font-fantasy tracking-wide text-lg drop-shadow-sm">Target</span>
          <span className="text-red-500 font-bold text-[9px] uppercase border border-red-900 px-1.5 py-0.5 rounded bg-red-950/40 tracking-wider">Enemy</span>
        </div>
        <div className="w-full h-4 bg-gray-900 rounded border border-gray-600 overflow-hidden relative">
           <div className="h-full bg-gradient-to-r from-red-900 to-red-600 w-full shadow-[0_0_10px_red]"></div>
           <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold drop-shadow-md">100%</span>
        </div>
      </div>

      {stats.quests && stats.quests.length > 0 && (
          <div className="absolute top-28 right-4 pointer-events-auto w-64 bg-black/60 border border-yellow-900/50 p-3 rounded text-sm backdrop-blur-sm shadow-xl">
             <div className="flex items-center gap-2 border-b border-yellow-800/50 pb-2 mb-2">
                 <Scroll size={16} className="text-yellow-500" />
                 <h3 className="text-yellow-500 font-bold uppercase text-xs tracking-wider">Active Quests</h3>
             </div>
             {stats.quests.map(q => {
                 const isReady = q.currentKills >= q.requiredKills;
                 return (
                     <div key={q.id} className="mb-3 last:mb-0">
                         <div className={`font-bold text-xs ${q.completed ? 'text-green-400 line-through' : 'text-yellow-100'}`}>
                             {q.name}
                         </div>
                         {!q.completed && (
                             <>
                                <div className="text-gray-400 text-[10px] mb-1 leading-tight opacity-90">{q.description}</div>
                                <div className="bg-gray-800 h-1.5 rounded-full overflow-hidden border border-gray-600/50">
                                    <div className={`h-full transition-all duration-500 ${isReady ? 'bg-green-500' : 'bg-yellow-600'}`} style={{ width: `${Math.min(100, (q.currentKills / q.requiredKills) * 100)}%` }}></div>
                                </div>
                                <div className="text-right text-[10px] text-gray-400 mt-0.5 font-mono">{q.currentKills} / {q.requiredKills}</div>
                             </>
                         )}
                         {isReady && !q.completed && (
                             <div className="text-[10px] text-green-400 italic mt-1 font-bold animate-pulse">Return to Village Elder</div>
                         )}
                     </div>
                 );
             })}
          </div>
      )}

      <div className="pointer-events-auto self-center mb-6 flex flex-col items-center gap-2">
        <div className="flex gap-4 bg-black/85 px-4 py-2 rounded-lg border border-gray-700 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)]">
           <div className="flex items-center gap-2" title="Adena">
              <Coins size={16} className="text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]" />
              <span className="text-yellow-100 text-xs font-bold">{adena.toLocaleString()}</span>
           </div>
           <div className="w-[1px] bg-gray-600"></div>
           <div 
             onClick={potions > 0 ? handleUsePotion : undefined}
             className={`flex items-center gap-2 px-2 -my-1 rounded transition-all group select-none
               ${potions > 0 ? 'cursor-pointer hover:bg-red-900/30 active:scale-95' : 'opacity-50 cursor-not-allowed grayscale'}`}
             title="Use Healing Potion"
           >
              <FlaskConical size={16} className={`text-red-400 ${potions > 0 ? 'group-hover:drop-shadow-[0_0_8px_red]' : ''}`} />
              <span className="text-red-100 text-xs font-bold">{potions}</span>
           </div>
           <div className="w-[1px] bg-gray-600"></div>
           <div 
             onClick={handleToggleSoulshot}
             className={`flex items-center gap-2 cursor-pointer px-2 -my-1 rounded transition-all border select-none ${
               stats.shotConfig?.soulshot 
                 ? 'bg-blue-900/30 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                 : 'border-transparent hover:bg-gray-800 opacity-70 hover:opacity-100'
             }`} 
             title="Toggle Auto-Soulshot"
           >
              <Sparkles size={16} className={stats.shotConfig?.soulshot ? "text-cyan-300 animate-pulse drop-shadow-[0_0_8px_cyan]" : "text-gray-400"} />
              <div className="flex flex-col leading-none">
                 <span className={`text-[9px] uppercase font-bold tracking-wide ${stats.shotConfig?.soulshot ? 'text-cyan-200' : 'text-gray-500'}`}>Soulshot</span>
                 <span className={`text-xs font-bold ${soulshots > 0 ? (stats.shotConfig?.soulshot ? 'text-white' : 'text-gray-400') : 'text-red-500'}`}>
                    {soulshots.toLocaleString()}
                 </span>
              </div>
           </div>
           <div 
             onClick={handleToggleSpiritshot}
             className={`flex items-center gap-2 cursor-pointer px-2 -my-1 rounded transition-all border select-none ${
               stats.shotConfig?.spiritshot 
                 ? 'bg-purple-900/30 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                 : 'border-transparent hover:bg-gray-800 opacity-70 hover:opacity-100'
             }`} 
             title="Toggle Auto-Spiritshot"
           >
              <Ghost size={16} className={stats.shotConfig?.spiritshot ? "text-purple-300 animate-pulse drop-shadow-[0_0_8px_purple]" : "text-gray-400"} />
              <div className="flex flex-col leading-none">
                 <span className={`text-[9px] uppercase font-bold tracking-wide ${stats.shotConfig?.spiritshot ? 'text-purple-200' : 'text-gray-500'}`}>Spiritshot</span>
                 <span className={`text-xs font-bold ${spiritshots > 0 ? (stats.shotConfig?.spiritshot ? 'text-white' : 'text-gray-400') : 'text-red-500'}`}>
                    {spiritshots.toLocaleString()}
                 </span>
              </div>
           </div>
        </div>

        <div className="flex gap-1.5 bg-black/85 p-2 rounded-xl border border-gray-600 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
           {[0, 1, 2, 3, 4, 5, 6, 7].map((slotIndex) => {
             const skillData = getSkillInSlot(slotIndex);
             const cooldownRemaining = skillData ? (stats.cooldowns?.[skillData.id] || 0) : 0;
             const onCooldown = cooldownRemaining > 0;
             const isOOM = skillData ? stats.mp < skillData.mpCost : false;
             
             const cdPercent = skillData && onCooldown 
                ? (cooldownRemaining / skillData.maxCooldown) * 100 
                : 0;

             return (
               <button 
                  key={slotIndex} 
                  onClick={() => handleSkillClick(slotIndex)}
                  className={`
                    w-14 h-14 relative rounded-md border-2 transition-all duration-100 group overflow-hidden
                    ${skillData 
                        ? (onCooldown 
                            ? 'bg-gray-900 border-gray-600 scale-[0.98]' 
                            : isOOM 
                                ? 'bg-gray-800 border-blue-900 opacity-70 grayscale-[0.8]' 
                                : 'bg-gray-800 border-gray-500 hover:border-yellow-400 hover:bg-gray-700 hover:scale-105 hover:shadow-[0_0_15px_rgba(250,204,21,0.3)] active:scale-95') 
                        : 'bg-black/40 border-gray-800 cursor-default shadow-inner'}
                  `}
               >
                  <span className="absolute top-0.5 left-1 text-[10px] text-gray-500 font-bold z-10 drop-shadow-md bg-black/60 px-1 rounded-sm border border-gray-800/50">{slotIndex + 1}</span>
                  
                  {skillData && (
                      <div className={`
                          w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900
                          ${onCooldown ? 'opacity-40 grayscale' : ''}
                          ${isOOM && !onCooldown ? 'opacity-50 text-blue-300 saturate-0' : ''}
                      `}>
                          {ICON_MAP[skillData.icon] || ICON_MAP['default']}
                      </div>
                  )}

                  {onCooldown && (
                    <div 
                        className="absolute bottom-0 left-0 w-full bg-black/70 pointer-events-none transition-all duration-[100ms] ease-linear border-t border-white/30"
                        style={{ height: `${cdPercent}%` }}
                    />
                  )}

                  {onCooldown && (
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                       <span className="text-white font-bold text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,1)] stroke-black" style={{textShadow: '0 0 4px black, 0 0 2px black'}}>
                          {cooldownRemaining > 1 ? cooldownRemaining.toFixed(0) : cooldownRemaining.toFixed(1)}
                       </span>
                    </div>
                  )}
                  
                  {isOOM && !onCooldown && skillData && (
                     <div className="absolute inset-0 flex items-center justify-center bg-blue-900/30 z-10 pointer-events-none">
                        <span className="text-[10px] font-bold text-blue-200 bg-black/60 px-1 rounded border border-blue-500/50">Low MP</span>
                     </div>
                  )}

                  {skillData && (
                    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 hidden group-hover:block bg-black/95 text-xs p-3 rounded-md border border-gray-600 w-48 z-50 pointer-events-none shadow-2xl">
                      <div className="text-yellow-400 font-bold text-sm mb-1">{skillData.name}</div>
                      <div className="text-gray-300 text-[11px] leading-tight mb-2 opacity-90">{skillData.description || "No description."}</div>
                      <div className="flex justify-between border-t border-gray-700 pt-1 text-[10px]">
                        <span className={`${isOOM ? 'text-red-400 font-bold' : 'text-blue-300 font-semibold'}`}>MP: {skillData.mpCost}</span>
                        <span className="text-gray-400">CD: {skillData.maxCooldown}s</span>
                      </div>
                    </div>
                  )}
               </button>
             );
           })}
        </div>
        
        <div className="mt-2 flex items-center gap-2 opacity-60">
           <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gray-500"></div>
           <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">Action Bar</span>
           <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gray-500"></div>
        </div>
      </div>
    </div>
  );
};