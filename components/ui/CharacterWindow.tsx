import React from 'react';
import { PlayerStats, InventoryItem } from '../../types';
import { X, User, Sword, Shield, Shirt, Footprints, Hand, Hexagon, Crown, Gem, Zap } from 'lucide-react';

interface CharacterWindowProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PlayerStats;
  onUnequip?: (slot: string) => void;
}

const StatRow: React.FC<{ label: string; value: number | string; color?: string }> = ({ label, value, color = "text-gray-200" }) => (
    <div className="flex justify-between items-center text-xs py-1 border-b border-gray-800 last:border-0">
        <span className="text-gray-500 uppercase font-bold tracking-wider">{label}</span>
        <span className={`font-mono font-bold ${color}`}>{value}</span>
    </div>
);

const EquipSlot: React.FC<{ slot: string; item: InventoryItem | null; icon: React.ReactNode; onClick?: () => void }> = ({ slot, item, icon, onClick }) => (
    <div 
      onClick={onClick}
      className={`relative group w-12 h-12 bg-gray-900 border border-gray-700 rounded flex items-center justify-center transition-all shadow-inner
      ${item ? 'cursor-pointer hover:border-red-500 hover:shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'cursor-default'}`}
    >
        {item ? (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center p-1">
                <div className="text-[9px] text-center leading-tight overflow-hidden text-yellow-100 font-bold">{item.name.split(' ').map(n => n[0]).join('')}</div>
            </div>
        ) : (
            <div className="opacity-20">{icon}</div>
        )}
        <div className="absolute top-0 right-0 text-[8px] bg-black/80 px-1 rounded-bl text-gray-500 uppercase">{slot.substring(0,2)}</div>
        
        {item && (
            <div className="absolute left-full top-0 ml-2 z-50 w-48 bg-black/95 border border-yellow-700/50 rounded p-2 text-xs hidden group-hover:block pointer-events-none shadow-xl">
                <div className="text-yellow-400 font-bold mb-1">{item.name}</div>
                <div className="text-gray-400 italic mb-2">{item.data?.type || "Item"}</div>
                {item.data?.description && <div className="text-gray-500 mb-2">{item.data.description}</div>}
                {item.data?.damage && <div className="text-red-300">P.Atk: {item.data.damage}</div>}
                {item.data?.defense && <div className="text-blue-300">P.Def: {item.data.defense}</div>}
                <div className="mt-2 text-[9px] text-red-400 uppercase font-bold text-center">Click to Unequip</div>
            </div>
        )}
    </div>
);

export const CharacterWindow: React.FC<CharacterWindowProps> = ({ isOpen, onClose, stats, onUnequip }) => {
  if (!isOpen) return null;

  const d = stats.details || {
      STR: 0, DEX: 0, CON: 0, INT: 0, WIT: 0, MEN: 0,
      PATK: 0, PDEF: 0, CRIT: 0, attackSpeed: 0, castSpeed: 0,
      maxHp: 0, maxMp: 0, maxCp: 0
  };

  const eq = stats.equipment || {};

  const handleSlotClick = (slot: string) => {
      if (onUnequip) onUnequip(slot);
  };

  return (
    <div className="pointer-events-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[450px] bg-black/90 border border-yellow-700/50 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col backdrop-blur-md font-sans z-40">
      <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-t-lg">
        <div className="flex items-center gap-2">
           <User className="text-yellow-500" size={20} />
           <span className="text-yellow-500 font-bold font-fantasy tracking-wider">Character Status</span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
          <div className="w-1/3 bg-black/20 p-4 border-r border-gray-700 overflow-y-auto">
             <div className="mb-4">
                 <h2 className="text-xl font-bold text-white mb-0 leading-none">{stats.name}</h2>
                 <div className="text-yellow-600 text-xs font-bold uppercase">{stats.class}</div>
                 <div className="text-gray-500 text-xs mt-1">Level {stats.level}</div>
                 <div className="w-full bg-gray-800 h-1 mt-1 rounded-full overflow-hidden">
                     <div className="bg-yellow-600 h-full" style={{ width: '45%' }}></div> 
                 </div>
             </div>

             <div className="space-y-4">
                 <div>
                     <h3 className="text-[10px] text-gray-500 uppercase font-bold mb-1 border-b border-gray-800">Basic Stats</h3>
                     <StatRow label="STR" value={d.STR} />
                     <StatRow label="DEX" value={d.DEX} />
                     <StatRow label="CON" value={d.CON} />
                     <StatRow label="INT" value={d.INT} />
                     <StatRow label="WIT" value={d.WIT} />
                     <StatRow label="MEN" value={d.MEN} />
                 </div>
                 
                 <div>
                     <h3 className="text-[10px] text-gray-500 uppercase font-bold mb-1 border-b border-gray-800">Combat Stats</h3>
                     <StatRow label="P. Atk" value={d.PATK} color="text-red-400" />
                     <StatRow label="P. Def" value={d.PDEF} color="text-blue-400" />
                     <StatRow label="Crit Rate" value={(d.CRIT * 100).toFixed(1) + '%'} />
                     <StatRow label="Atk. Spd" value={d.attackSpeed} />
                     <StatRow label="Cast. Spd" value={d.castSpeed} />
                 </div>
             </div>
          </div>

          <div className="flex-1 p-6 relative bg-gradient-to-b from-gray-900/50 to-black/80">
             <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                 <User size={200} />
             </div>

             <div className="relative h-full w-full max-w-sm mx-auto flex flex-col justify-between">
                 <div className="flex justify-center mb-4">
                    <EquipSlot slot="head" item={eq.head || null} icon={<Crown size={20} />} onClick={() => handleSlotClick('head')} />
                 </div>

                 <div className="flex justify-between flex-1">
                     <div className="flex flex-col gap-3">
                        <EquipSlot slot="chest" item={eq.chest} icon={<Shirt size={20} />} onClick={() => handleSlotClick('chest')} />
                        <EquipSlot slot="legs" item={eq.legs} icon={<User size={20} />} onClick={() => handleSlotClick('legs')} />
                        <EquipSlot slot="gloves" item={eq.gloves} icon={<Hand size={20} />} onClick={() => handleSlotClick('gloves')} />
                        <EquipSlot slot="boots" item={eq.boots} icon={<Footprints size={20} />} onClick={() => handleSlotClick('boots')} />
                     </div>

                     <div className="flex flex-col gap-3 items-end">
                        <EquipSlot slot="rightHand" item={eq.rightHand} icon={<Sword size={20} />} onClick={() => handleSlotClick('rightHand')} />
                        <EquipSlot slot="leftHand" item={eq.leftHand} icon={<Shield size={20} />} onClick={() => handleSlotClick('leftHand')} />
                        
                        <div className="h-4"></div> 
                        
                        <div className="flex gap-1 justify-end">
                            <EquipSlot slot="necklace" item={eq.necklace} icon={<Hexagon size={16} />} onClick={() => handleSlotClick('necklace')} />
                        </div>
                        <div className="flex gap-1 justify-end">
                            <EquipSlot slot="earring1" item={eq.earring1} icon={<Gem size={16} />} onClick={() => handleSlotClick('earring1')} />
                            <EquipSlot slot="earring2" item={eq.earring2} icon={<Gem size={16} />} onClick={() => handleSlotClick('earring2')} />
                        </div>
                        <div className="flex gap-1 justify-end">
                            <EquipSlot slot="ring1" item={eq.ring1} icon={<Zap size={16} />} onClick={() => handleSlotClick('ring1')} />
                            <EquipSlot slot="ring2" item={eq.ring2} icon={<Zap size={16} />} onClick={() => handleSlotClick('ring2')} />
                        </div>
                     </div>
                 </div>
                 
                 <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs border-t border-gray-700 pt-3 opacity-80">
                    <div className="bg-gray-800/50 rounded p-1">
                        <div className="text-red-400 font-bold">{d.maxHp}</div>
                        <div className="text-[9px] text-gray-500 uppercase">Max HP</div>
                    </div>
                    <div className="bg-gray-800/50 rounded p-1">
                        <div className="text-yellow-500 font-bold">{d.maxCp}</div>
                        <div className="text-[9px] text-gray-500 uppercase">Max CP</div>
                    </div>
                    <div className="bg-gray-800/50 rounded p-1">
                        <div className="text-blue-400 font-bold">{d.maxMp}</div>
                        <div className="text-[9px] text-gray-500 uppercase">Max MP</div>
                    </div>
                 </div>

             </div>
          </div>
      </div>
    </div>
  );
};