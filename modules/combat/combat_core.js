import { player } from "../characters/player.js";

export const CombatCore = {
    enterCombat(target) {
        if (!target || target.dead) return;
        if (player.target !== target || !player.inCombat) {
            player.dispatchMessage('warning', `Combat Engaged: ${target.name} (Lv.${target.level})`);
        }
        player.inCombat = true;
        player.target = target;
    },

    exitCombat() {
        if (!player.inCombat) return;
        player.dispatchMessage('info', "Combat Disengaged.");
        player.inCombat = false;
        player.target = null;
    },

    updateCombatDistance() {
        if (!player.inCombat || !player.target) return;
        const mob = player.target;
        if (!mob || mob.dead) {
            this.exitCombat();
            return;
        }
        const dx = player.group.position.x - mob.position.x;
        const dz = player.group.position.z - mob.position.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist > 12) {
            player.dispatchMessage('info', "Target is too far. Combat ended.");
            this.exitCombat();
        }
    },

    handleAttack(attacker, defender, modifiers = {}) {
        if (!attacker || !defender || defender.dead) return null;
        let pAtk = 10;
        let pDef = 10;
        let critRate = 0.05;
        let soulshotMult = 1.0;

        if (attacker === player) {
            pAtk = player.final?.PATK || (player.final?.STR * 1.5) || 40;
            critRate = (player.final?.CRIT || 40) / 300; 
            if (player.consumeSoulshot && player.consumeSoulshot()) {
                soulshotMult = 2.0;
            }
        } else {
            pAtk = attacker.attackPower || 10;
            critRate = 0.05; 
        }

        const skillPower = modifiers.skillPower || 1.0;
        pAtk *= skillPower;

        if (defender === player) {
            pDef = player.final?.PDEF || 20;
        } else {
            pDef = defender.pDef || 10;
        }

        let multiplier = soulshotMult;
        let isCrit = false;
        critRate *= (modifiers.critMod || 1.0);

        if (Math.random() < critRate) {
            isCrit = true;
            multiplier *= 2.0; 
        }

        const defFactor = Math.sqrt(pDef);
        let damage = (pAtk * multiplier) / defFactor;
        damage *= (0.95 + Math.random() * 0.10);
        damage = Math.floor(damage);
        if (damage < 1) damage = 1;

        if (typeof defender.takeDamage === 'function') {
            defender.takeDamage(damage);
        } else {
            defender.hp -= damage;
            if (defender.hp < 0) defender.hp = 0;
            if (defender.animSM) defender.animSM.setState("hit");
        }

        return {
            damage,
            isCrit,
            isSoulshot: (soulshotMult > 1 && !isCrit),
            isSkill: modifiers.isSkill || false,
            targetDead: (defender.hp <= 0)
        };
    }
};