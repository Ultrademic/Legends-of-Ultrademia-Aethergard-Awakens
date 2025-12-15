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
        const model = await loadMonsterModel(config.family || "wolf");
        model.position.set(x, 0, z);
        scene.add(model);

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
            model,
            position: model.position,
            homeX: x,
            homeZ: z,
        };

        mob.animSM = new AnimationStateMachine(mob);

        if (model.animations && model.animations.length > 0) {
            const mapped = {};
            for (const clip of model.animations) {
                mapped[clip.name.toLowerCase()] = clip;
            }
            mob.animSM.animations = mapped;
            mob.animSM.setState("idle");
        }

        registerMonster(mob);
        createNameplate(model, `${config.name} [Lv.${config.level}]`, config.level);
        createHealthbar(model, config.maxHp);

        mob.attackPlayer = () => {
            monsterAttackPlayer(mob);
        };

        return mob;
    } catch (err) {
        console.error("Spawn Failed:", err);
        return null;
    }
}