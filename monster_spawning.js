// /modules/ai/monster_spawning.js
// ULTRADEMIC MONSTER SPAWNER — GLB wolves, fallback wolves, AI-ready, UI-ready

import { scene } from "../../core/renderer.js";
import { player } from "../characters/player.js";

import { AnimationStateMachine } from "../animation/AnimationStateMachine.js";
import { loadMonsterModel } from "../animation/anim_loader.js";

import { createNameplate } from "../ui/nameplates.js";
import { createHealthbar } from "../ui/healthbars.js";

import { registerMonster } from "./monster_ai.js";
import { monsterAttackPlayer } from "../combat/damage.js";

export async function spawnMonster(config, x, z) {
    try {
        console.log(
            `%c[Spawn] Summoning ${config.name} (Lv.${config.level}) at ${x}, ${z}`,
            "color:cyan;font-weight:bold"
        );

        // Load real GLB wolf OR fallback model
        const model = await loadMonsterModel(config.family || "wolf");
        model.position.set(x, 0, z);

        // Store as 3D object in scene
        scene.add(model);

        // Standard mob object
        const mob = {
            name: config.name,
            family: config.family || "wolf",
            level: config.level,

            hp: config.maxHp,
            maxHp: config.maxHp,

            attackPower: config.attackPower,
            attackRange: config.attackRange || 1.5,
            attackCooldown: config.attackCooldown || 1.4,
            moveSpeed: config.moveSpeed || 3.5,

            pDef: config.pDef || 12,

            aggressive: config.aggressive || false,
            aggroRange: config.aggroRange || 8,
            leashRange: config.leashRange || 14,

            xpReward: config.xpReward || 20,

            adenaDrop: config.adenaDrop || { min: 5, max: 20 },
            drops: config.drops || [],

            dead: false,
            inCombat: false,
            target: null,

            _canAttack: true,

            // world-space reference
            model,
            position: model.position,

            // for resetting pull-distance
            homeX: x,
            homeZ: z,
        };

        // Bind animation system
        mob.animSM = new AnimationStateMachine(mob);

        // Load animation clips (GLB wolves include real anims)
        if (model.animations && model.animations.length > 0) {
            const mapped = {};
            for (const clip of model.animations) {
                mapped[clip.name.toLowerCase()] = clip;
            }
            mob.animSM.animations = mapped;
            mob.animSM.setState("idle");
        }

        // Register with AI
        registerMonster(mob);

        // UI overlays
        createNameplate(model, `${config.name} [Lv.${config.level}]`, config.level);
        createHealthbar(model, config.maxHp);

        // Combat binding
        mob.attackPlayer = () => {
            monsterAttackPlayer(mob);
        };

        console.log(
            `%c[Spawn] SUCCESS → ${config.name} spawned`,
            "color:lime;font-weight:bold"
        );

        return mob;

    } catch (err) {
        console.error(
            "%c[Spawn] FAILED → The gods refused the summon:",
            "color:red;font-weight:bold",
            err
        );
        return null;
    }
}
