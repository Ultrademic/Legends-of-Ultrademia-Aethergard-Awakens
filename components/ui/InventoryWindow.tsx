import React from 'react';
import { InventoryItem } from '../../types';
import { X, Backpack, Sword, Shield, Shirt, Footprints, FlaskConical, Sparkles, Ghost, Package } from 'lucide-react';

interface InventoryWindowProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: InventoryItem[];
  onItemClick: (id: string) => void;
  adena: number;
}

const ICON_MAP: Record<string, React.ReactNode> = {
    "sword": <Sword size={20} className="text-yellow-200" />,
    "shield": <Shield size={20} className="text-blue-200" />,
    "cloth": <Shirt size={20} className="text-purple-200" />,
    "leather": <Shirt size={20} className="text-green-200" />,
    "boots": <Footprints size={20} className="text-gray-300" />,
    "consumable": <FlaskConical size={20} className="text-red-300" />,
    "loot": <Package size={20} className="text-orange-200" />
};

export const InventoryWindow: React.FC<InventoryWindowProps> = ({ isOpen, onClose, inventory, onItemClick, adena }) => {
  if (!isOpen) return null;

  const slots = [...inventory];
  while (slots.length < 40) {
      slots.push({ id: `empty-${slots.length}`, name: '', count: 0 });
  }

  const getItemIcon = (item: InventoryItem) => {
      if (item.count === 0) return null;
      if (item.id.includes("soulshot")) return <Sparkles size={20} className="text-cyan-300" />;
      if (item.id.includes("spiritshot")) return <Ghost size={20} className="text-purple-300" />;
      if (item.id.includes("potion")) return <FlaskConical size={20} className="text-red-400" />;
      const type = item.data?.type || "loot";
      return ICON_MAP[type] || ICON_MAP["loot"];
  };

  return (
    <div className="pointer-events-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] bg-black/90 border border-gray-600 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col backdrop-blur-md font-sans z-50">
      <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gradient-to-r from-gray-900 to-black rounded-t-lg">
        <div className="flex items-center gap-2">
           <Backpack className="text-yellow-500" size={20} />
           <span className="text-yellow-500 font-bold font-fantasy tracking-wider">Inventory</span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="p-4 grid grid-cols-5 gap-2 max-h-[400px] overflow-y-auto custom-scrollbar">
          {slots.map((item, index) => {
              const isEmpty = item.count === 0;
              const isGear = item.data?.type && !['consumable', 'loot'].includes(item.data.type);
              
              return (
                  <div 
                    key={item.id}
                    onClick={() => !isEmpty && onItemClick(item.id)}
                    className={`
                        relative w-14 h-14 bg-gray-900 border border-gray-700 rounded flex items-center justify-center group
                        ${!isEmpty ? 'cursor-pointer hover:border-yellow-500 hover:shadow-[0_0_10px_rgba(234,179,8,0.2)]' : ''}
                    `}
                  >
                      {!isEmpty && (
                          <>
                             <div className="opacity-90 transition-transform group-hover:scale-110">
                                {getItemIcon(item)}
                             </div>
                             {item.count > 1 && (
                                 <span className="absolute bottom-1 right-1 text-[10px] text-white font-mono bg-black/60 px-1 rounded">
                                     {item.count}
                                 </span>
                             )}
                             {isGear && <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_lime]"></div>}
                             
                             <div className="absolute left-full top-0 ml-2 z-50 w-48 bg-black/95 border border-yellow-700/50 rounded p-2 text-xs hidden group-hover:block pointer-events-none shadow-xl">
                                <div className="text-yellow-400 font-bold mb-1">{item.name}</div>
                                <div className="text-gray-400 italic mb-2">{item.data?.type || "Item"}</div>
                                {item.data?.description && <div className="text-gray-500 mb-2">{item.data.description}</div>}
                                {item.data?.damage && <div className="text-red-300">P.Atk: {item.data.damage}</div>}
                                {item.data?.defense && <div className="text-blue-300">P.Def: {item.data.defense}</div>}
                                {isGear ? (
                                    <div className="mt-2 text-[9px] text-green-400 uppercase font-bold text-center">Click to Equip</div>
                                ) : (
                                    <div className="mt-2 text-[9px] text-yellow-400 uppercase font-bold text-center">Click to Use</div>
                                )}
                            </div>
                          </>
                      )}
                  </div>
              );
          })}
      </div>

      <div className="p-3 bg-black/60 border-t border-gray-700 rounded-b-lg flex justify-between items-center text-xs text-gray-400">
         <span>Slots: {inventory.length} / 60</span>
         <div className="font-bold text-yellow-500">{adena.toLocaleString()} Adena</div>
      </div>
    </div>
  );
};