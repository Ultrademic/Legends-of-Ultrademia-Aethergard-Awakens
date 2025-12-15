import { player } from "../characters/player.js";
import { XPSystem } from "./xp_system.js";

export const QUESTS = {
    WOLF_CULL: {
        id: "WOLF_CULL",
        name: "Cull the Gladeon Wolves",
        description: "The Village Elder has asked you to thin the wolf packs near Gladeon. Slay 5 Gladeon Wolves.",
        dialogue: {
            start: "The wolves are encroaching on the village. Brave adventurer, I need you to thin their numbers. Slay 5 Gladeon Wolves and return to me.",
            progress: "You have not completed the task yet. The pack is still a threat.",
            complete: "Splendid work! The village is safer now thanks to your steel. Take these supplies for your journey."
        },
        zone: "village",
        requiredKills: 5,
        currentKills: 0,
        targetFamilies: ["wolf"],
        started: false,
        readyToComplete: false,
        completed: false,
        rewardXp: 120,
        rewardAdena: 80,
        rewardItems: [
            { id: "potion_healing", count: 3, name: "Lesser Healing Potion", icon: "flask" }
        ]
    }
};

const questList = Object.values(QUESTS);

export function initQuests() {
    if (!window.QUEST_STATE_LOADED) {
        questList.forEach(q => {
            q.currentKills = 0;
            q.completed = false;
            q.readyToComplete = false;
            q.started = false;
        });
        window.QUEST_STATE_LOADED = true;
    }
}

export function getActiveQuests() {
    return Object.values(QUESTS).filter(q => q.started && !q.completed);
}

export function getQuestById(id) {
    return QUESTS[id];
}

export function startQuest(id) {
    const quest = QUESTS[id];
    if (!quest || quest.started) return;
    quest.started = true;
    quest.readyToComplete = false;
    quest.completed = false;
    quest.currentKills = 0;
    player.dispatchMessage('quest', `Quest Accepted: ${quest.name}`);
}

export function completeQuest(id) {
    const quest = QUESTS[id];
    if (!quest || !quest.readyToComplete || quest.completed) return;
    quest.completed = true;
    quest.readyToComplete = false; 
    if (!player.adena) player.adena = 0;
    player.adena += quest.rewardAdena;
    XPSystem.addXP(quest.rewardXp);
    let itemsLog = "";
    if (quest.rewardItems) {
        quest.rewardItems.forEach(item => {
            player.addItem(item.id, item.count, item.name, { type: "consumable" });
            itemsLog += `, ${item.count}x ${item.name}`;
        });
    }
    const msg = `Quest Complete: ${quest.name}! Earned ${quest.rewardXp} XP, ${quest.rewardAdena} Adena${itemsLog}`;
    player.dispatchMessage('quest', msg);
}

export function updateQuestProgress(mob, drops = []) {
    if (!mob) return;
    questList.forEach(quest => {
        if (!quest.started || quest.completed || quest.readyToComplete) return;
        switch (quest.id) {
            case "WOLF_CULL":
                handleWolfCullQuest(quest, mob);
                break;
            default:
                break;
        }
    });
}

function handleWolfCullQuest(quest, mob) {
    const fam = mob.family || "";
    if (!quest.targetFamilies.includes(fam)) return;
    quest.currentKills++;
    player.dispatchMessage('quest', `Quest Update: ${quest.name} (${quest.currentKills}/${quest.requiredKills})`);
    if (quest.currentKills >= quest.requiredKills) {
        quest.readyToComplete = true;
        player.dispatchMessage('quest', `Quest Objective Complete! Return to the Village Elder.`);
    }
}