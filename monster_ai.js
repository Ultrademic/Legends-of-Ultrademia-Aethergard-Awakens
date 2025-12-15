// /modules/ai/monster_ai.js
// ULTRADEMIC MONSTER AI — chase, leash, attack, return-home logic

import { player } from "../characters/player.js";

export const monsters = [];

/**
 * Registered by monster_spawning.js — adds the mob to the AI system
 */
export function registerMonster(mob) {
    monsters.push(mob);
}

/**
 * Called every frame by engine.js
 */
export function updateMonsterAI(dt) {
    for (const mob of monsters) {
        if (!mob || mob.dead) continue;

        const dx = player.group.position.x - mob.position.x;
        const dz = player.group.position.z - mob.position.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        // -----------------------------
        // PASSIVE MOBS
        // -----------------------------
        if (!mob.aggressive) {
            if (mob.inCombat) {
                chasePlayer(mob, dx, dz, dist, dt);
            }
            continue;
        }

        // -----------------------------
        // AGGRESSIVE MOBS
        // -----------------------------
        if (!mob.inCombat && dist < mob.aggroRange) {
            mob.inCombat = true;
            mob.target = player;
            mob.animSM.setState("moving");
        }

        if (mob.inCombat) {
            chasePlayer(mob, dx, dz, dist, dt);
        }
    }
}

/**
 * Monster chasing + attacking logic
 */
function chasePlayer(mob, dx, dz, dist, dt) {

    // Return to home if player outruns leash range
    if (dist > mob.leashRange) {
        mob.inCombat = false;
        mob.target = null;
        mob.animSM.setState("idle");
        returnHome(mob, dt);
        return;
    }

    // Move toward player
    if (dist > mob.attackRange) {
        const step = mob.moveSpeed * dt;
        mob.position.x += (dx / dist) * step;
        mob.position.z += (dz / dist) * step;

        mob.animSM.setState("moving");
    } else {
        // Close enough to attack
        mob.animSM.setState("attack");

        if (mob._canAttack) {
            mob._canAttack = false;
            mob.attackPlayer(mob); // defined in monster_spawning
            setTimeout(() => mob._canAttack = true, mob.attackCooldown * 1000);
        }
    }
}

/**
 * Monster returns to starting point
 */
function returnHome(mob, dt) {
    const dx = mob.homeX - mob.position.x;
    const dz = mob.homeZ - mob.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < 0.1) {
        mob.animSM.setState("idle");
        return;
    }

    const step = mob.moveSpeed * dt;
    mob.position.x += (dx / dist) * step;
    mob.position.z += (dz / dist) * step;

    mob.animSM.setState("moving");
}
