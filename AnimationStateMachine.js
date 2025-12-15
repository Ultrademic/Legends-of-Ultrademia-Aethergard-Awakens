// modules/animation/AnimationStateMachine.js
// ULTRADEMIC ANIMATION STATE MACHINE
// Works perfectly with animation mixers + fallback models

export class AnimationStateMachine {
    constructor(entity) {
        this.entity = entity;

        // Current logical state (not the GLB animation name)
        this.state = "idle";

        // Used only for fallback (non-GLB) animations
        this.time = 0;
    }

    // ----------------------------------------------------
    // Set logical state → converted to real animation name
    // ----------------------------------------------------
    setState(newState) {
        if (this.state === newState) return;
        this.state = newState;

        const mapping = {
            idle: "idle",
            moving: "walk",
            attack: "attack",
            attacking: "attack",
            dead: "dead",
        };

        const anim = mapping[newState] || "idle";

        // Fallback models use entity.userData.animate
        if (this.entity.userData.isFallback) {
            this.time = 0;
            return;
        }

        // GLB models use the player's Mixer animation system
        if (this.entity.playAnimation) {
            this.entity.playAnimation(anim);
        }
    }

    // ----------------------------------------------------
    // Called every frame by player.update(dt)
    // ----------------------------------------------------
    update(dt) {
        // Fallback animation system
        if (this.entity.userData?.isFallback && this.entity.userData?.animate) {
            this.time += dt;
            this.entity.userData.animate(this.entity, dt, this.state);
            return;
        }

        // GLB models use AnimationMixer directly — nothing to do
    }
}
