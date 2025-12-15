import React, { useState, useEffect } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/ui/HUD';
import { ChatWindow } from './components/ui/ChatWindow';
import { VendorWindow } from './components/ui/VendorWindow';
import { CharacterWindow } from './components/ui/CharacterWindow';
import { InventoryWindow } from './components/ui/InventoryWindow';
import { QuestDialog } from './components/ui/QuestDialog';
import { ToastOverlay } from './components/ui/ToastOverlay';
import { INITIAL_PLAYER_STATS } from './constants';
import { PlayerStats, GameState, Race, SkillData, VendorItem, InventoryItem, Quest, SaveData } from './types';
import { BASE_CLASSES } from './modules/progression/base_classes.js';
import { RACE_STATS } from './modules/progression/race_stats.js';
import { Plus, Trash2, Play, User, Sword, Sparkles } from 'lucide-react';

import { player as gamePlayer } from './modules/characters/player.js';
import { getActiveQuests, getQuestById, startQuest, completeQuest } from './modules/progression/starter_zone_quests.js';
import { Persistence } from './modules/systems/persistence.js';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.LOGIN);
  const [playerStats, setPlayerStats] = useState<PlayerStats>({ ...INITIAL_PLAYER_STATS, skills: [] });
  
  const [selectedRace, setSelectedRace] = useState<Race>('human');
  const [selectedArchetype, setSelectedArchetype] = useState<'fighter' | 'mystic'>('fighter');
  const [heroName, setHeroName] = useState('');
  const [activeSlot, setActiveSlot] = useState<number>(-1);
  const [saveSlots, setSaveSlots] = useState<(SaveData | null)[]>([null, null, null]);

  const [vendorOpen, setVendorOpen] = useState(false);
  const [vendorData, setVendorData] = useState<{ name: string; items: VendorItem[] }>({ name: '', items: [] });
  const [charWindowOpen, setCharWindowOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [questDialogOpen, setQuestDialogOpen] = useState(false);
  const [currentQuestNpc, setCurrentQuestNpc] = useState('');
  const [currentQuestData, setCurrentQuestData] = useState<Quest | null>(null);
  const [questDialogueText, setQuestDialogueText] = useState('');

  useEffect(() => {
      setSaveSlots(Persistence.getSlots());
  }, []);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;

    if (gameState === GameState.PLAYING) {
      intervalId = setInterval(() => {
          const player = gamePlayer;
          if (!player) return;

          const inv = player.inventory || [];
          const soulshots = inv.find((i: any) => i.id.includes('soulshot'))?.count || 0;
          const spiritshots = inv.find((i: any) => i.id.includes('spiritshot'))?.count || 0;
          const potions = inv.find((i: any) => i.id.includes('potion'))?.count || 0;
          
          const finalStats = player.final || {};
          const equipment = player.equipment || {};

          setPlayerStats(prev => ({
            ...prev,
            hp: Math.floor(player.hp || 0),
            maxHp: Math.floor(player.maxHp || 1),
            mp: Math.floor(player.mp || 0),
            maxMp: Math.floor(player.maxMp || 1),
            cp: Math.floor(player.cp || 0),
            maxCp: Math.floor(player.maxCp || 1),
            level: player.level || 1,
            exp: player.xp || 0,
            name: player.name || prev.name, 
            class: player.baseClass || prev.class,
            skills: player.skills || [],
            skillDetails: player.getSkillConfig ? (player.getSkillConfig() as SkillData[]) : [],
            cooldowns: player.getSkillCooldowns ? (player.getSkillCooldowns() as Record<string, number>) : {},
            inventory: inv as InventoryItem[], 
            consumables: {
                soulshots,
                spiritshots,
                healthPotions: potions,
                adena: player.adena || 0
            },
            shotConfig: player.shotConfig ? { ...player.shotConfig } : { soulshot: false, spiritshot: false },
            details: {
                STR: finalStats.STR || 0,
                DEX: finalStats.DEX || 0,
                CON: finalStats.CON || 0,
                INT: finalStats.INT || 0,
                WIT: finalStats.WIT || 0,
                MEN: finalStats.MEN || 0,
                PATK: finalStats.PATK || 0,
                PDEF: finalStats.PDEF || 0,
                CRIT: finalStats.CRIT || 0,
                attackSpeed: finalStats.attackSpeed || 0,
                castSpeed: finalStats.castSpeed || 0,
                maxHp: finalStats.maxHp || 0,
                maxMp: finalStats.maxMp || 0,
                maxCp: finalStats.maxCp || 0
            },
            equipment: { ...equipment },
            quests: getActiveQuests()
          }));
      }, 100); 
      
      const saveInterval = setInterval(() => {
          if (gamePlayer && gamePlayer.hp > 0) Persistence.save();
      }, 60000);

      return () => {
          clearInterval(intervalId);
          clearInterval(saveInterval);
      };
    }
  }, [gameState]);

  useEffect(() => {
    const handleOpenVendor = (e: Event) => {
        const detail = (e as CustomEvent).detail;
        if (detail) {
            setVendorData({ name: detail.npcName, items: detail.items });
            setVendorOpen(true);
            setCharWindowOpen(false); setInventoryOpen(false); setQuestDialogOpen(false);
        }
    };

    const handleOpenQuest = (e: Event) => {
        const detail = (e as CustomEvent).detail;
        if (detail && detail.questId) {
            const q = getQuestById(detail.questId);
            if (q) {
                let text = q.dialogue?.start || "Greetings.";
                if (q.started) text = q.dialogue?.progress || "How goes the hunt?";
                if (q.currentKills >= q.requiredKills) text = q.dialogue?.complete || "Well done.";
                
                setCurrentQuestNpc(detail.npcName);
                setCurrentQuestData(q);
                setQuestDialogueText(text);
                setQuestDialogOpen(true);
                setVendorOpen(false); setCharWindowOpen(false); setInventoryOpen(false);
            }
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
        if (e.key.toLowerCase() === 'c') setCharWindowOpen(prev => !prev);
        if (e.key.toLowerCase() === 'i' || e.key.toLowerCase() === 'b') setInventoryOpen(prev => !prev);
    };

    window.addEventListener('UI_OPEN_VENDOR', handleOpenVendor);
    window.addEventListener('UI_OPEN_QUEST', handleOpenQuest);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
        window.removeEventListener('UI_OPEN_VENDOR', handleOpenVendor);
        window.removeEventListener('UI_OPEN_QUEST', handleOpenQuest);
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleEnterLobby = () => {
      setSaveSlots(Persistence.getSlots());
      setGameState(GameState.CHARACTER_SELECT);
  };

  const handleSelectSlotForCreation = (index: number) => {
      setActiveSlot(index);
      setGameState(GameState.RACE_SELECT);
  };

  const handlePlayCharacter = (index: number) => {
      setActiveSlot(index);
      Persistence.loadCharacter(index);
      const data = saveSlots[index];
      if (data) {
          gamePlayer.spawn(data.race, data.archetype).then(() => {
              Persistence.apply(data);
              setGameState(GameState.PLAYING);
          });
      }
  };

  const handleDeleteCharacter = (index: number) => {
      if (window.confirm("Delete this character? This cannot be undone.")) {
          Persistence.deleteCharacter(index);
          setSaveSlots(Persistence.getSlots());
      }
  };

  const handleRaceSelect = (race: Race) => {
    setSelectedRace(race);
    setGameState(GameState.CLASS_SELECT);
  };

  const handleArchetypeSelect = (archetype: 'fighter' | 'mystic') => {
    setSelectedArchetype(archetype);
    setGameState(GameState.NAME_INPUT);
  };

  const handleNameSubmit = () => {
      if (!heroName.trim()) return;
      gamePlayer.name = heroName; 
      gamePlayer.spawn(selectedRace, selectedArchetype).then(() => {
          Persistence.setActiveSlot(activeSlot);
          Persistence.save(); 
          setGameState(GameState.PLAYING);
      });
  };

  if (gameState === GameState.LOGIN) {
    return (
      <div className="w-full h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
           <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-900 via-gray-900 to-black"></div>
        </div>
        <div className="z-10 text-center space-y-8 p-10 bg-black/40 backdrop-blur-lg border border-yellow-900/50 rounded-xl max-w-lg w-full animate-[fadeIn_1s_ease-out]">
           <div>
            <h1 className="text-6xl font-fantasy text-yellow-500 tracking-wider mb-2 drop-shadow-lg" style={{textShadow: '0 0 10px rgba(234, 179, 8, 0.5)'}}>
                ULTRADEMIC
            </h1>
            <p className="text-gray-400 tracking-[0.2em] text-sm uppercase">Resurrection of the Fallen</p>
           </div>
           <button onClick={handleEnterLobby} className="w-full bg-gradient-to-r from-yellow-800 to-yellow-600 hover:from-yellow-700 hover:to-yellow-500 text-white font-bold py-4 px-6 rounded border border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all transform hover:scale-[1.02] tracking-widest text-lg">
                ENTER WORLD
           </button>
        </div>
      </div>
    );
  }

  if (gameState === GameState.CHARACTER_SELECT) {
      return (
        <div className="w-full h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black z-0"></div>
            <h1 className="text-4xl font-fantasy text-yellow-500 mb-12 z-10 drop-shadow-md">Select Character</h1>
            <div className="flex gap-8 z-10">
                {saveSlots.map((slot, index) => (
                    <div key={index} className={`
                        w-64 h-96 rounded-lg border-2 flex flex-col transition-all duration-300 relative
                        ${slot ? 'bg-gray-900/80 border-gray-600 hover:border-yellow-500 shadow-2xl' : 'bg-black/40 border-gray-800 border-dashed hover:border-gray-600 hover:bg-gray-900/40'}
                    `}>
                        {slot ? (
                            <>
                                <div className="flex-1 p-6 flex flex-col items-center pt-10">
                                    <div className="w-20 h-20 bg-black rounded-full border border-gray-500 mb-4 flex items-center justify-center">
                                        <User size={40} className="text-gray-400" />
                                    </div>
                                    <h2 className="text-xl font-bold text-yellow-100 mb-1">{slot.name}</h2>
                                    <div className="text-sm text-gray-400 mb-4">Level {slot.level} {RACE_STATS[slot.race]?.name}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-widest">{slot.baseClass}</div>
                                    <div className="mt-auto text-xs text-gray-600">Last Played: {new Date(slot.timestamp).toLocaleDateString()}</div>
                                </div>
                                <div className="p-4 border-t border-gray-700 grid grid-cols-4 gap-2">
                                    <button onClick={() => handlePlayCharacter(index)} className="col-span-3 bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-700 hover:to-blue-500 text-white font-bold py-2 rounded flex items-center justify-center gap-2 transition-all">
                                        <Play size={16} fill="currentColor" /> ENTER
                                    </button>
                                    <button onClick={() => handleDeleteCharacter(index)} className="col-span-1 bg-red-900/30 hover:bg-red-900/60 border border-red-900 text-red-400 rounded flex items-center justify-center transition-all">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <button onClick={() => handleSelectSlotForCreation(index)} className="w-full h-full flex flex-col items-center justify-center text-gray-600 hover:text-yellow-500 transition-colors group">
                                <div className="w-16 h-16 rounded-full border-2 border-gray-700 group-hover:border-yellow-500 flex items-center justify-center mb-4 transition-colors">
                                    <Plus size={32} />
                                </div>
                                <span className="uppercase tracking-widest text-sm font-bold">Create New</span>
                            </button>
                        )}
                    </div>
                ))}
            </div>
            <button onClick={() => setGameState(GameState.LOGIN)} className="mt-12 text-gray-500 hover:text-white underline z-10">Back to Title</button>
        </div>
      );
  }

  if (gameState === GameState.RACE_SELECT) {
    return (
      <div className="w-full h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden text-white">
         <h1 className="text-4xl font-fantasy text-yellow-500 mb-8">Choose Lineage</h1>
         <div className="flex gap-6">
            {(Object.keys(RACE_STATS) as Race[]).map((race) => (
              <div key={race} onClick={() => handleRaceSelect(race)} className="w-64 p-6 bg-gray-900/80 border border-gray-700 hover:border-yellow-500 rounded-lg cursor-pointer transition-all hover:scale-105">
                <h2 className="text-2xl font-bold mb-2 text-yellow-100">{RACE_STATS[race].name}</h2>
                <p className="text-sm text-gray-400 mb-4 h-20">{RACE_STATS[race].description}</p>
                <div className="text-xs text-blue-300">Bonuses: {Object.keys(RACE_STATS[race].bonuses).join(', ')}</div>
              </div>
            ))}
         </div>
         <div className="mt-8"><button onClick={() => setGameState(GameState.CHARACTER_SELECT)} className="text-gray-500 hover:text-white underline">Cancel</button></div>
      </div>
    );
  }

  if (gameState === GameState.CLASS_SELECT) {
    const raceClasses = BASE_CLASSES[selectedRace];
    return (
      <div className="w-full h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden text-white">
         <h1 className="text-4xl font-fantasy text-yellow-500 mb-2">Choose Path</h1>
         <h2 className="text-xl text-gray-400 mb-8">Race: {RACE_STATS[selectedRace].name}</h2>
         <div className="flex gap-8">
             <div onClick={() => handleArchetypeSelect('fighter')} className="w-80 bg-gray-900/90 border-2 border-gray-700 hover:border-red-500 p-8 rounded-xl cursor-pointer transition-all hover:scale-105 group">
                <div className="flex justify-center mb-4"><Sword size={48} className="text-gray-500 group-hover:text-red-500 transition-colors"/></div>
                <h3 className="text-2xl font-bold text-white mb-2 text-center">{raceClasses.fighter.name}</h3>
                <p className="text-gray-400 text-sm text-center mb-6 h-12">{raceClasses.fighter.description}</p>
                <div className="text-xs text-gray-500 uppercase font-bold mb-1">Weapons</div>
                <div className="text-sm text-gray-300 mb-4 capitalize">{raceClasses.fighter.weapons.join(', ')}</div>
                <div className="text-xs text-gray-500 uppercase font-bold mb-1">Roles</div>
                <div className="text-sm text-gray-300 capitalize">{raceClasses.fighter.roles.join(', ')}</div>
             </div>
             <div onClick={() => handleArchetypeSelect('mystic')} className="w-80 bg-gray-900/90 border-2 border-gray-700 hover:border-blue-500 p-8 rounded-xl cursor-pointer transition-all hover:scale-105 group">
                <div className="flex justify-center mb-4"><Sparkles size={48} className="text-gray-500 group-hover:text-blue-500 transition-colors"/></div>
                <h3 className="text-2xl font-bold text-white mb-2 text-center">{raceClasses.mystic.name}</h3>
                <p className="text-gray-400 text-sm text-center mb-6 h-12">{raceClasses.mystic.description}</p>
                <div className="text-xs text-gray-500 uppercase font-bold mb-1">Weapons</div>
                <div className="text-sm text-gray-300 mb-4 capitalize">{raceClasses.mystic.weapons.join(', ')}</div>
                <div className="text-xs text-gray-500 uppercase font-bold mb-1">Roles</div>
                <div className="text-sm text-gray-300 capitalize">{raceClasses.mystic.roles.join(', ')}</div>
             </div>
         </div>
         <button onClick={() => setGameState(GameState.RACE_SELECT)} className="mt-8 text-gray-500 hover:text-white underline">Back</button>
      </div>
    );
  }

  if (gameState === GameState.NAME_INPUT) {
      return (
        <div className="w-full h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-900/20 via-black to-black z-0"></div>
            <div className="z-10 bg-gray-900/90 border border-gray-600 p-10 rounded-lg shadow-2xl text-center max-w-md w-full">
                <h2 className="text-2xl font-fantasy text-yellow-500 mb-2">Name Your Hero</h2>
                <p className="text-gray-400 text-sm mb-6 uppercase tracking-wider">{BASE_CLASSES[selectedRace][selectedArchetype].name}</p>
                <input 
                    type="text" 
                    value={heroName}
                    onChange={(e) => setHeroName(e.target.value)}
                    placeholder="Enter Name..." 
                    className="w-full bg-black/60 border border-gray-500 rounded p-4 text-center text-xl text-white focus:border-yellow-500 focus:outline-none mb-8"
                    maxLength={16}
                />
                <button 
                    onClick={handleNameSubmit}
                    disabled={!heroName.trim()}
                    className={`w-full py-4 font-bold rounded border shadow-lg transition-all ${heroName.trim() ? 'bg-gradient-to-r from-yellow-700 to-yellow-500 text-white border-yellow-400 hover:scale-[1.02]' : 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed'}`}
                >
                    AWAKEN
                </button>
            </div>
            <button onClick={() => setGameState(GameState.CLASS_SELECT)} className="mt-6 text-gray-500 hover:text-white underline z-10">Back</button>
        </div>
      );
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none">
      <GameCanvas race={selectedRace} playerClass={BASE_CLASSES[selectedRace][selectedArchetype].name} />
      <HUD stats={playerStats} />
      
      <VendorWindow isOpen={vendorOpen} onClose={() => setVendorOpen(false)} npcName={vendorData.name} items={vendorData.items} playerAdena={playerStats.consumables?.adena ?? 0} inventory={playerStats.inventory || []} />
      <CharacterWindow isOpen={charWindowOpen} onClose={() => setCharWindowOpen(false)} stats={playerStats} onUnequip={(slot) => gamePlayer.unequipItem(slot)} />
      <InventoryWindow isOpen={inventoryOpen} onClose={() => setInventoryOpen(false)} inventory={playerStats.inventory || []} onItemClick={(id) => gamePlayer.useItem(id)} adena={playerStats.consumables?.adena ?? 0} />
      <QuestDialog isOpen={questDialogOpen} onClose={() => setQuestDialogOpen(false)} npcName={currentQuestNpc} questData={currentQuestData} dialogueText={questDialogueText} onAccept={startQuest} onComplete={completeQuest} />

      {playerStats.hp <= 0 && (
          <div className="pointer-events-auto absolute inset-0 z-[200] bg-black/80 flex flex-col items-center justify-center animate-[fadeIn_1s_ease-out]">
              <h1 className="text-6xl text-red-600 font-fantasy font-bold mb-4 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)] tracking-widest uppercase">You Have Fallen</h1>
              <p className="text-gray-400 mb-8 text-lg">The aether reclaims your soul...</p>
              <button onClick={() => gamePlayer.respawn()} className="px-8 py-3 bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white font-bold rounded border border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all transform hover:scale-105">Return to Village</button>
          </div>
      )}

      <ToastOverlay />
      <ChatWindow />
      <div className="absolute bottom-1 right-2 text-gray-600 text-xs pointer-events-none">Ultrademic RPG Client v0.9.5-β</div>
    </div>
  );
};

export default App;