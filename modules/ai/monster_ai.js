import { player } from "../characters/player.js";

export const monsters = [];

export function registerMonster(mob) {
    monsters.push(mob);
}

export function updateMonsterAI(dt) {
    for (const mob of monsters) {
        if (!mob || mob.dead) continue;

        const dx = player.group.position.x - mob.position.x;
        const dz = player.group.position.z - mob.position.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (!mob.aggressive) {
            if (mob.inCombat) {
                chasePlayer(mob, dx, dz, dist, dt);
            }
            continue;
        }

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

function chasePlayer(mob, dx, dz, dist, dt) {
    if (dist > mob.leashRange) {
        mob.inCombat = false;
        mob.target = null;
        mob.animSM.setState("idle");
        returnHome(mob, dt);
        return;
    }

    if (dist > mob.attackRange) {
        const step = mob.moveSpeed * dt;
        mob.position.x += (dx / dist) * step;
        mob.position.z += (dz / dist) * step;
        mob.animSM.setState("moving");
    } else {
        mob.animSM.setState("attack");
        if (mob._canAttack) {
            mob._canAttack = false;
            mob.attackPlayer(mob); 
            setTimeout(() => mob._canAttack = true, mob.attackCooldown * 1000);
        }
    }
}

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