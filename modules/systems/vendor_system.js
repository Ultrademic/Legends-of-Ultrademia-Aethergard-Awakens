import { player } from "../characters/player.js";
import { VENDOR_ITEMS } from "../items/vendor_items.js";

export const VendorSystem = {
    openShop(npc) {
        window.dispatchEvent(new CustomEvent('UI_OPEN_VENDOR', { 
            detail: { 
                npcName: npc.npcName, 
                items: VENDOR_ITEMS 
            } 
        }));
    },
    buy(itemId, amount = 1) {
        const item = VENDOR_ITEMS.find(i => i.id === itemId);
        if (!item) return;
        const cost = item.price * amount;
        player.buyItem(itemId, amount, cost, item.name, { type: item.type });
    },
    sell(itemId, amount = 1) {
        player.sellItem(itemId, amount);
    }
};
window.game = window.game || {};
window.game.buy = VendorSystem.buy;
window.game.sell = VendorSystem.sell;