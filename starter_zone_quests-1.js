// /modules/progression/starter_zone_quests.js
// ULTRADEMIC STARTER QUESTS — Gladeon Village (Lineage 2–inspired)

import { player } from "../characters/player.js";
import { XPSystem } from "./xp_system.js";

// ---------------------------------------------------------------------
// QUEST DEFINITIONS
// ---------------------------------------------------------------------

export const QUESTS = {
    WOLF_CULL: {
        id: "WOLF_CULL",
        name: "Cull the Gladeon Wolves",
        description: "The Village Elder has asked you to thin the wolf packs near Gladeon. Slay 5 Gladeon Wolves.",
        zone: "village",

        // Conditions
        requiredKills: 5,
        currentKills: 0,
        targetFamilies: ["wolf_village"], // family from monster_spawning config
        completed: false,
        started: false,

        // Rewards
        rewardXp: 120,
        rewardAdena: 80
    }
};

// Internal reference so we can loop easily
const questList = Object.values(QUESTS);

// ---------------------------------------------------------------------
// INIT — called once when the village zone loads
// ---------------------------------------------------------------------
export function initQuests() {
    questList.forEach(q => {
        q.currentKills = 0;
        q.completed = false;
        q.started = false;
    });

    console.log("%c[Quests] Starter zone quests initialized.", "color:violet");
}

// ---------------------------------------------------------------------
// START A QUEST (e.g. when talking to Village Elder)
// ---------------------------------------------------------------------
export function startQuest(id) {
    const quest = QUESTS[id];
    if (!quest) {
        console.warn("[Quests] Tried to start unknown quest:", id);
        return;
    }
    if (quest.started) {
        console.log("[Quests] Quest already started:", quest.name);
        return;
    }

    quest.started = true;
    quest.completed = false;
    quest.currentKills = 0;

    console.log(
        `%c[Quest Started] ${quest.name} — ${quest.description}`,
        "color:gold;font-weight:bold"
    );
}

// ---------------------------------------------------------------------
// UPDATE PROGRESS — called whenever a mob dies
//  from damage.js / monster_spawning.js:
//    updateQuestProgress(mob, drops)
// ---------------------------------------------------------------------
export function updateQuestProgress(mob, drops = []) {
    if (!mob) return;

    questList.forEach(quest => {
        if (!quest.started || quest.completed) return;

        switch (quest.id) {
            case "WOLF_CULL":
                handleWolfCullQuest(quest, mob);
                break;

            default:
                break;
        }
    });
}

// ---------------------------------------------------------------------
// SPECIFIC QUEST HANDLERS
// ---------------------------------------------------------------------

function handleWolfCullQuest(quest, mob) {
    // Only count specific monster families (e.g. "wolf_village")
    const fam = mob.family || "";
    if (!quest.targetFamilies.includes(fam)) return;

    quest.currentKills++;
    console.log(
        `%c[Quest] ${quest.name}: ${quest.currentKills}/${quest.requiredKills} Gladeon Wolves slain.`,
        "color:lightgreen"
    );

    // Not done yet
    if (quest.currentKills < quest.requiredKills) return;

    // COMPLETE!
    quest.completed = true;

    console.log(
        `%c[Quest Complete] ${quest.name} — return to the Village Elder!`,
        "color:lime;font-weight:bold"
    );

    // Rewards
    if (!player.adena) player.adena = 0;
    player.adena += quest.rewardAdena;

    XPSystem.addXP(quest.rewardXp);

    console.log(
        `%c[Rewards] +${quest.rewardXp} XP, +${quest.rewardAdena} Adena (Total Adena: ${player.adena})`,
        "color:gold;font-weight:bold"
    );
}
