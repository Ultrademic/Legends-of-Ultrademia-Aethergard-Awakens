import React, { useState } from 'react';
import { VendorItem, InventoryItem } from '../../types';
import { X, Coins, FlaskConical, Sparkles, Ghost, ShoppingBag, Package } from 'lucide-react';
import { VendorSystem } from '../../modules/systems/vendor_system.js';

interface VendorWindowProps {
  isOpen: boolean;
  onClose: () => void;
  npcName: string;
  items: VendorItem[];
  playerAdena: number;
  inventory?: InventoryItem[];
}

const ICON_MAP: Record<string, React.ReactNode> = {
  "soulshot_ng": <Sparkles size={20} className="text-cyan-300" />,
  "spiritshot_ng": <Ghost size={20} className="text-purple-300" />,
  "potion_healing": <FlaskConical size={20} className="text-red-400" />,
  "default": <ShoppingBag size={20} className="text-gray-400" />,
  "loot": <Package size={20} className="text-orange-300" />
};

export const VendorWindow: React.FC<VendorWindowProps> = ({ isOpen, onClose, npcName, items, playerAdena, inventory = [] }) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');

  if (!isOpen) return null;

  const handleQuantityChange = (id: string, val: string) => {
    const num = parseInt(val.replace(/\D/g, '')) || 0;
    setQuantities(prev => ({ ...prev, [id]: num }));
  };

  const handleBuy = (item: VendorItem) => {
    const amount = quantities[item.id] || 1;
    if (amount <= 0) return;
    VendorSystem.buy(item.id, amount);
  };

  const handleSell = (item: InventoryItem) => {
    const amount = quantities[item.id] || 1;
    if (amount <= 0 || amount > item.count) return;
    VendorSystem.sell(item.id, amount);
  };

  const sellableItems = inventory.filter(i => i.data?.price && i.data.price > 0);

  return (
    <div className="pointer-events-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] bg-black/90 border border-yellow-700/50 rounded-lg shadow-2xl flex flex-col backdrop-blur-md font-sans z-50">
      <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gradient-to-r from-gray-900 to-black rounded-t-lg">
        <div className="flex items-center gap-2">
           <Coins className="text-yellow-500" size={20} />
           <span className="text-yellow-500 font-bold font-fantasy tracking-wider">{npcName || "Merchant"}</span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex border-b border-gray-700">
        <button 
          onClick={() => setMode('buy')}
          className={`flex-1 py-2 text-sm font-bold uppercase transition-colors ${mode === 'buy' ? 'bg-yellow-900/40 text-yellow-200 border-b-2 border-yellow-500' : 'text-gray-500 hover:bg-gray-800'}`}
        >
          Buy Supplies
        </button>
        <button 
          onClick={() => setMode('sell')}
          className={`flex-1 py-2 text-sm font-bold uppercase transition-colors ${mode === 'sell' ? 'bg-green-900/40 text-green-200 border-b-2 border-green-500' : 'text-gray-500 hover:bg-gray-800'}`}
        >
          Sell Loot
        </button>
      </div>

      <div className="flex-1 p-4 space-y-2 max-h-[360px] overflow-y-auto">
        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 text-xs text-gray-500 uppercase font-bold px-2 mb-2 border-b border-gray-800 pb-2">
           <span>Item</span>
           <span></span>
           <span>{mode === 'buy' ? 'Price' : 'Value'}</span>
           <span>Action</span>
        </div>

        {mode === 'buy' ? (
            items.map(item => {
               const qty = quantities[item.id] ?? 1;
               const cost = item.price * qty;
               const canAfford = playerAdena >= cost;

               return (
                 <div key={item.id} className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 p-2 bg-gray-800/40 rounded hover:bg-gray-800/80 transition-colors border border-transparent hover:border-gray-600">
                    <div className="w-10 h-10 bg-black/60 rounded border border-gray-600 flex items-center justify-center shadow-inner">
                       {ICON_MAP[item.id] || ICON_MAP['default']}
                    </div>
                    <div className="flex flex-col">
                       <span className="text-gray-200 font-bold text-sm">{item.name}</span>
                       <span className="text-gray-500 text-[10px]">{item.description}</span>
                    </div>
                    <div className="flex flex-col items-end w-24">
                       <div className="flex items-center gap-1 text-yellow-400 font-bold">
                          <span className="text-xs">{item.price}</span>
                          <span className="text-[10px] text-gray-500">ea</span>
                       </div>
                       <div className={`text-xs mt-1 ${canAfford ? 'text-gray-300' : 'text-red-500'}`}>
                          Total: {cost.toLocaleString()}
                       </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <input 
                          type="text" 
                          value={quantities[item.id] ?? 1}
                          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                          className="w-16 bg-black border border-gray-600 rounded p-1 text-center text-white text-sm focus:border-yellow-500 outline-none"
                       />
                       <button 
                          onClick={() => handleBuy(item)}
                          disabled={!canAfford || qty <= 0}
                          className={`px-3 py-1 rounded font-bold text-xs transition-all ${
                             canAfford && qty > 0
                               ? 'bg-yellow-700 hover:bg-yellow-600 text-white shadow-lg' 
                               : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          }`}
                       >
                          BUY
                       </button>
                    </div>
                 </div>
               );
            })
        ) : (
            sellableItems.length === 0 ? (
                <div className="text-center text-gray-500 py-10 italic">No sellable items found.</div>
            ) : (
                sellableItems.map(item => {
                   const qty = quantities[item.id] ?? 1;
                   const val = (item.data?.price || 0);
                   const totalVal = val * Math.min(qty, item.count);
                   const maxSellable = item.count;

                   return (
                     <div key={item.id} className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 p-2 bg-gray-800/40 rounded hover:bg-gray-800/80 transition-colors border border-transparent hover:border-green-900/30">
                        <div className="w-10 h-10 bg-black/60 rounded border border-gray-600 flex items-center justify-center shadow-inner">
                           {ICON_MAP[item.id] || ICON_MAP['loot']}
                        </div>
                        <div className="flex flex-col">
                           <span className="text-gray-200 font-bold text-sm">{item.name}</span>
                           <span className="text-gray-500 text-[10px]">In Bag: {item.count}</span>
                        </div>
                        <div className="flex flex-col items-end w-24">
                           <div className="flex items-center gap-1 text-green-400 font-bold">
                              <span className="text-xs">{val}</span>
                              <span className="text-[10px] text-gray-500">ea</span>
                           </div>
                           <div className="text-xs mt-1 text-gray-300">
                              Gain: {totalVal.toLocaleString()}
                           </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <input 
                              type="text" 
                              value={quantities[item.id] ?? 1}
                              onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                              className="w-16 bg-black border border-gray-600 rounded p-1 text-center text-white text-sm focus:border-green-500 outline-none"
                           />
                           <button 
                              onClick={() => handleSell(item)}
                              disabled={qty <= 0 || qty > maxSellable}
                              className={`px-3 py-1 rounded font-bold text-xs transition-all ${
                                 qty > 0 && qty <= maxSellable
                                   ? 'bg-green-800 hover:bg-green-700 text-white shadow-lg' 
                                   : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                              }`}
                           >
                              SELL
                           </button>
                        </div>
                     </div>
                   );
                })
            )
        )}
      </div>

      <div className="p-3 bg-black/60 border-t border-gray-700 rounded-b-lg flex justify-between items-center">
         <span className="text-gray-400 text-xs uppercase tracking-widest">Your Wealth</span>
         <div className="flex items-center gap-2 text-yellow-400 font-bold text-lg">
            <Coins size={18} />
            {playerAdena.toLocaleString()} Adena
         </div>
      </div>
    </div>
  );
};