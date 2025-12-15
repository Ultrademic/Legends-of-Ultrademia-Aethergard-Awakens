// /modules/characters/player.js
// ULTRADEMIC PLAYER CONTROLLER — L2 Stats + Animation + Combat Integration

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.168.0/build/three.module.js";

import { scene as importedScene } from "../../core/renderer.js";
import { loadPlayerModel } from "../animation/anim_loader.js";
import { AnimationStateMachine } from "../animation/AnimationStateMachine.js";

// NEW — L2 stat engine
import { computeFinalStats } from "./player_stats.js";

// Fallback scene reference
const scene = importedScene || window.scene;

export const player = {

    // 3D representation
    group: null,
    mixer: null,
    actions: {},
    currentAction: null,
    animSM: null,

    // Core identity
    race: "human",
    baseClass: "fighter", // reserved for future class system

    // L2 progression
    level: 1,
    xp: 0,

    // FULL STAT OBJECTS
    base: null,   // pre-level-scaling, after race mods
    final: null,  // fully computed stats (PATK, PDEF, HP, MP)

    // Combat
    inCombat: false,
    target: null,
    isMoving: false,
    soulshots: 0, // for future L2 SS mechanic

    hp: 1,
    mp: 1,
    maxHp: 1,
    maxMp: 1,

    // ------------------------------------------------------------
    // SPAWN PLAYER WITH RACE + ANIMATIONS + STATS
    // ------------------------------------------------------------
    async spawn(race = "human") {
        this.race = race;

        console.log(
            `%c[Player] Summoning ${race.toUpperCase()} into Aethergard...`,
            "color:gold;font-weight:bold"
        );

        // Load GLB model for the race (currently only human)
        this.group = await loadPlayerModel(race);
        this.group.position.set(0, 0, 2);
        this.group.keep = true; // persists between zone loads

        if (scene && scene.add) scene.add(this.group);

        // ------------------------------------------------------------
        // STATS — compute full L2 stat profile
        // ------------------------------------------------------------
        this.final = computeFinalStats(this.race, this.level);

        this.hp = this.final.maxHp;
        this.mp = this.final.maxMp;
        this.maxHp = this.final.maxHp;
        this.maxMp = this.final.maxMp;

        console.log(
            `%c[Player] Stats initialized:\n${JSON.stringify(this.final, null, 2)}`,
            "color:cyan"
        );

        // ------------------------------------------------------------
        // ANIMATIONS
        // ------------------------------------------------------------
        this.mixer = new THREE.AnimationMixer(this.group);
        this.actions = {};

        if (this.group.animations) {
            Object.entries(this.group.animations).forEach(([name, clip]) => {
                this.actions[name.toLowerCase()] = this.mixer.clipAction(clip);
            });
        }

        // Default animation
        if (this.actions.idle) {
            this.actions.idle.play();
            this.currentAction = this.actions.idle;
        }

        // State machine
        this.animSM = new AnimationStateMachine(this);

        console.log(
            `%c[Player] ${race.toUpperCase()} spawned successfully.`,
            "color:lime;font-weight:bold"
        );

        return this.group;
    },

    // ------------------------------------------------------------
    // ANIMATION SWITCHING
    // ------------------------------------------------------------
    playAnimation(name) {
        name = name.toLowerCase();
        if (!this.actions[name]) return;

        if (this.currentAction === this.actions[name]) return;

        if (this.currentAction)
            this.currentAction.fadeOut(0.15);

        const next = this.actions[name];
        next.reset().fadeIn(0.15).play();

        this.currentAction = next;
    },

    // ------------------------------------------------------------
    // PLAYER TAKES DAMAGE (L2 style)
    // ------------------------------------------------------------
    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp < 0) this.hp = 0;

        if (this.hp === 0) {
            console.warn("%c[Player] You have died!", "color:red;font-size:18px");
            // Later: death anim, respawn UI
        }
    },

    // ------------------------------------------------------------
    // FRAME UPDATE — CALLED BY ENGINE
    // ------------------------------------------------------------
    update(dt) {
        if (this.mixer) this.mixer.update(dt);

        // Combat priority
        if (this.inCombat && this.target && !this.target.dead) {
            this.playAnimation("attack");
            return;
        }

        // Movement
        if (this.isMoving) {
            this.playAnimation("walk");
            return;
        }

        // Idle fallback
        this.playAnimation("idle");
    }
};
