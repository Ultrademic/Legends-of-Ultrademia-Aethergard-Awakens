// /modules/animation/fallback_anims.js
// ULTRADEMIC PROCEDURAL ANIM CLIPS — Used by fallback humanoid models
// These are math-based animations that mimic idle/walk/run/attack/dead states.

export function createFallbackClips() {

    return {
        idle: {
            name: "idle",
            duration: Infinity,
            loop: true,
            update(obj, t) {
                // gentle breathing motion
                const breathe = Math.sin(t * 1.5) * 0.03;
                obj.children.forEach(part => {
                    part.position.y += breathe;
                });
            }
        },

        walk: {
            name: "walk",
            duration: Infinity,
            loop: true,
            update(obj, t) {
                const speed = 6;
                const swing = Math.sin(t * speed) * 0.25;
                const counter = Math.sin(t * speed + Math.PI) * 0.25;

                // arms (index: torso=0, head=1, Larm=2, Rarm=3, Lleg=4, Rleg=5)
                const leftArm = obj.children[2];
                const rightArm = obj.children[3];
                const leftLeg = obj.children[4];
                const rightLeg = obj.children[5];

                if (leftArm) leftArm.rotation.x = swing;
                if (rightArm) rightArm.rotation.x = counter;
                if (leftLeg) leftLeg.rotation.x = counter;
                if (rightLeg) rightLeg.rotation.x = swing;
            }
        },

        run: {
            name: "run",
            duration: Infinity,
            loop: true,
            update(obj, t) {
                const speed = 11;
                const swing = Math.sin(t * speed) * 0.45;
                const counter = Math.sin(t * speed + Math.PI) * 0.45;

                const leftArm = obj.children[2];
                const rightArm = obj.children[3];
                const leftLeg = obj.children[4];
                const rightLeg = obj.children[5];

                if (leftArm) leftArm.rotation.x = swing * 1.1;
                if (rightArm) rightArm.rotation.x = counter * 1.1;
                if (leftLeg) leftLeg.rotation.x = counter;
                if (rightLeg) rightLeg.rotation.x = swing;
            }
        },

        attack: {
            name: "attack",
            duration: 0.6,
            loop: false,
            update(obj, t) {
                const arm = obj.children[3]; // right arm
                if (!arm) return;

                // simple swing arc
                const phase = t / 0.6;
                if (phase < 0.5) {
                    arm.rotation.x = -Math.PI * phase;          // wind-up
                } else {
                    arm.rotation.x = -Math.PI * (1 - phase);    // follow-through
                }
            }
        },

        dead: {
            name: "dead",
            duration: Infinity,
            loop: false,
            update(obj, t) {
                // collapse the model
                obj.rotation.z = Math.PI / 2;
                obj.position.y = 0.1;
            }
        }
    };
}
