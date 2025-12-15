export class AnimationStateMachine {
    constructor(entity) {
        this.entity = entity;
        this.state = "idle";
        this.time = 0;
    }

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

        if (this.entity.userData.isFallback) {
            this.time = 0;
            return;
        }

        if (this.entity.playAnimation) {
            this.entity.playAnimation(anim);
        }
    }

    update(dt) {
        if (this.entity.userData?.isFallback && this.entity.userData?.animate) {
            this.time += dt;
            this.entity.userData.animate(this.entity, dt, this.state);
            return;
        }
    }
}