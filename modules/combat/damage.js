import { player } from "../characters/player.js";
import { CombatCore } from "./combat_core.js";
import { XPSystem } from "../progression/xp_system.js";
import { updateQuestProgress } from "../progression/starter_zone_quests.js";
import { spawnFloatingText } from "../ui/floating_text.js";
import { spawnHitEffect } from "./projectiles.js";
import { scheduleRespawn } from "../ai/monster_spawning.js";

export let lastAttackTime = 0;
const ATTACK_COOLDOWN = 0.9;
const ANIM_DURATION = 0.8;

export function updateCombat(dt) {
    if (!player.inCombat || !player.target || player.target.dead) return;
    const now = performance.now() / 1000;
    if (now - lastAttackTime >= ATTACK_COOLDOWN) {
        performAttack();
        lastAttackTime = now;
    }
}

function performAttack() {
    const mob = player.target;
    if (!mob || mob.dead) {
        CombatCore.exitCombat();
        return;
    }

    if (player.playAnimation && !player.isBusy) {
        player.isBusy = true;
        setTimeout(() => player.isBusy = false, ANIM_DURATION * 1000);
        if (player.actions['attack']) {
             player.actions['attack'].stop();
             player.actions['attack'].play();
             player.currentAction = player.actions['attack'];
        } else {
             player.playAnimation("attack");
        }
    }

    const pAtk = player.final.PATK || 10;
    const pDef = Math.sqrt(mob.pDef || 10);
    let ssMult = 1;
    let isSoulshot = false;

    if (player.consumeSoulshot && player.consumeSoulshot()) {
        ssMult = 2;
        isSoulshot = true;
    }

    const critRate = (player.final.DEX || 30) / 250 + 0.04;
    const isCrit = Math.random() < critRate;

    let damage = Math.floor(
        (pAtk / pDef) *
        ssMult *
        (isCrit ? 2.0 : 1) * 
        (player.gradeScale || 1.0)
    );

    damage *= (0.95 + Math.random() * 0.1);
    damage = Math.floor(damage);
    damage = Math.max(1, damage);

    mob.hp -= damage;
    mob.animSM.setState("hit"); 

    spawnFloatingText(mob.model || mob, damage, isCrit ? 'crit' : 'damage');
    setTimeout(() => {
        spawnHitEffect(mob.position, isCrit ? 'crit' : 'physical');
    }, 300);

    player.dispatchMessage('combat', `You hit ${mob.name} for ${damage} damage.${isCrit ? ' (Critical)' : ''}${isSoulshot ? ' (Soulshot)' : ''}`);

    mob.inCombat = true;
    mob.target = player;

    if (mob.hp <= 0) {
        mob.hp = 0;
        mob.dead = true;
        handleMobDeath(mob);
    }
}

function handleMobDeath(mob) {
    CombatCore.exitCombat();
    updateQuestProgress(mob, mob.drops);
    XPSystem.addXP(mob.xpReward);
    spawnFloatingText(player.group, mob.xpReward, 'xp');

    const adena = Math.floor(
        Math.random() * (mob.adenaDrop.max - mob.adenaDrop.min) +
        mob.adenaDrop.min
    );

    player.adena = (player.adena || 0) + adena;
    if (adena > 0) {
        player.dispatchMessage('loot', `You picked up ${adena} Adena.`);
    }

    mob.drops?.forEach(drop => {
        if (Math.random() < drop.chance) {
            const id = drop.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
            const count = drop.count || 1;
            player.addItem(id, count, drop.name, drop);
            player.dispatchMessage('loot', `You picked up ${drop.name} (${count}).`);
        }
    });

    // Hide monster and schedule respawn
    mob.position.y = -999; 
    mob.dead = true;
    
    // Stop any AI intervals
    if (mob._interval) clearInterval(mob._interval);

    // Schedule Respawn (e.g. 8 seconds)
    scheduleRespawn(mob, 8000);
}

export function monsterAttackPlayer(mob) {
    const pAtk = mob.attackPower;
    const pDef = Math.sqrt(player.final?.PDEF || 15);
    let damage = Math.floor((pAtk / pDef) * (player.gradeScale || 1.0));
    damage += Math.floor(Math.random() * 4) - 1;
    player.takeDamage(damage);
    
    spawnFloatingText(player.group, damage, 'crit'); 
    
    // Blood effect
    setTimeout(() => {
        spawnHitEffect(player.group.position, 'blood');
    }, 200);

    player.dispatchMessage('combat', `${mob.name} hit you for ${damage} damage.`);
    
    if (player.hp <= 0) {
        CombatCore.exitCombat();
        player.dispatchMessage('error', `You have been slain by ${mob.name}!`);
    }
}