// /modules/combat/damage.js
// ULTRADEMIC COMBAT — L2-style physical damage, crits, soulshots, XP, drops

import { player } from "../characters/player.js";
import { CombatCore } from "./combat_core.js";
import { XPSystem } from "../progression/xp_system.js";
import { updateQuestProgress } from "../progression/starter_zone_quests.js";

export let lastAttackTime = 0;
const ATTACK_COOLDOWN = 0.9;

/**
 * Called every frame by engine.js -> updateCombat(dt)
 */
export function updateCombat(dt) {
    if (!player.inCombat || !player.target || player.target.dead) return;

    const now = performance.now() / 1000;

    if (now - lastAttackTime >= ATTACK_COOLDOWN) {
        performAttack();
        lastAttackTime = now;
    }
}

/**
 * Player hitting a monster
 */
function performAttack() {
    const mob = player.target;
    if (!mob || mob.dead) {
        CombatCore.exitCombat();
        return;
    }

    // -----------------------------
    // L2-style damage formula
    // -----------------------------
    const pAtk = player.final.STR * 0.8 + (player.weapon?.damage || 5);
    const pDef = Math.sqrt(mob.pDef || 10);

    let ss = player.soulshots > 0 ? 2 : 1;
    if (player.soulshots > 0) {
        player.soulshots--;
        console.log("%cSoulshot! x2 DMG", "color:cyan");
    }

    const critRate = player.final.DEX / 250 + 0.04;
    const isCrit = Math.random() < critRate;

    let damage = Math.floor(
        (pAtk / pDef) *
        ss *
        (isCrit ? 4 : 1) *
        (player.gradeScale || 1.0)
    );

    damage += Math.floor(Math.random() * 5) - 2;
    damage = Math.max(1, damage);

    // Apply damage
    mob.hp -= damage;
    mob.animSM.setState("attack");

    console.log(
        `${isCrit ? "CRIT! " : ""}You hit ${mob.name} for ${damage} DMG (${mob.hp}/${mob.maxHp})`
    );

    // Mark combat flags
    mob.inCombat = true;
    mob.target = player;

    // Monster death
    if (mob.hp <= 0) {
        mob.hp = 0;
        mob.dead = true;
        handleMobDeath(mob);
    }
}

/**
 * On monster kill
 */
function handleMobDeath(mob) {
    console.log(`%cKILL → +${mob.xpReward} XP`, "color:gold");

    // Always clean combat
    CombatCore.exitCombat();

    // Update quests
    updateQuestProgress(mob, mob.drops);

    // XP
    XPSystem.addXP(mob.xpReward);

    // Adena drop
    const adena = Math.floor(
        Math.random() * (mob.adenaDrop.max - mob.adenaDrop.min) +
        mob.adenaDrop.min
    );

    player.adena = (player.adena || 0) + adena;

    // Loot drops
    const gotDrops = [];
    mob.drops?.forEach(drop => {
        if (Math.random() < drop.chance) {
            gotDrops.push(drop);
        }
    });

    if (gotDrops.length > 0) {
        console.log("%cDrops:", "color:lime", gotDrops);
        // TODO: inventory integration
    }

    // Remove from play
    mob.position.y = -999; // hide
    if (mob._interval) clearInterval(mob._interval);
}

/**
 * Monster hitting player
 */
export function monsterAttackPlayer(mob) {
    const pAtk = mob.attackPower;
    const pDef = Math.sqrt(player.pDef || 15);

    let damage = Math.floor((pAtk / pDef) * (player.gradeScale || 1.0));
    damage += Math.floor(Math.random() * 4) - 1;

    player.takeDamage(damage);

    console.log(`%c${mob.name} hit you for ${damage}`, "color:red");

    if (player.hp <= 0) {
        CombatCore.exitCombat();
    }
}
