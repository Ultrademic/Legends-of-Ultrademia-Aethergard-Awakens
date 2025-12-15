// /modules/animation/anim_loader.js
// ULTRADEMIC ANIMATION LOADER — Race-aware, Human real GLB, others fallback-safe

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.168.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.168.0/examples/jsm/loaders/GLTFLoader.js";

import { createFallbackModel } from "./fallback_model.js";
import { createFallbackClips } from "./fallback_anims.js";

const loader = new GLTFLoader();

// ---------------------------------------------------------
//  LOAD PLAYER MODEL BY RACE
// ---------------------------------------------------------
export async function loadPlayerModel(race = "human") {

    // HUMAN — real working assets
    if (race === "human") {
        try {
            const idleGLB = await loader.loadAsync("/assets/races/human/human_idle.glb");
            const group = idleGLB.scene;

            group.scale.set(0.01, 0.01, 0.01);
            group.position.y = -0.9;

            group.traverse(obj => {
                if (obj.isMesh) {
                    obj.castShadow = true;
                    obj.receiveShadow = true;
                }
            });

            // store animations in simple object
            const anims = {};

            if (idleGLB.animations.length > 0)
                anims.idle = idleGLB.animations[0];

            // helper loader
            async function loadAnim(name, path) {
                try {
                    const glb = await loader.loadAsync(path);
                    if (glb.animations.length > 0) anims[name] = glb.animations[0];
                } catch (err) {
                    console.warn(`[AnimLoader] Missing file: ${path}`);
                }
            }

            // load remaining animations
            await loadAnim("walk",   "/assets/races/human/human_walk.glb");
            await loadAnim("run",    "/assets/races/human/human_run.glb");
            await loadAnim("attack", "/assets/races/human/human_attack.glb");

            group.animations = anims;

            console.log("%c[AnimLoader] HUMAN loaded successfully!", "color:lime");
            return group;

        } catch (err) {
            console.error("[AnimLoader] Human GLB failed → fallback:", err);
        }
    }

    // ---------------------------------------------------------
    // ELF / DARK ELF — no GLBs yet → fallback model
    // ---------------------------------------------------------
    console.warn(`[AnimLoader] ${race.toUpperCase()} has no assets → using fallback model`);

    const fallback = createFallbackModel();
    fallback.animations = Object.values(createFallbackClips());
    return fallback;
}

// ---------------------------------------------------------
//  MONSTER LOADER — unchanged
// ---------------------------------------------------------
export async function loadMonsterModel(family = "wolf") {
    try {
        const glb = await loader.loadAsync("/assets/Models/monsters/wolf.glb");
        const model = glb.scene;

        model.scale.set(0.8, 0.8, 0.8);

        model.traverse(o => {
            if (o.isMesh) {
                o.castShadow = true;
                o.receiveShadow = true;
            }
        });

        model.animations = glb.animations;
        model.userData.isFallback = false;

        console.log("%c[AnimLoader] Real wolf loaded!", "color:cyan");
        return model;

    } catch (err) {
        console.warn("[AnimLoader] Wolf GLB missing → fallback");

        const fb = createFallbackModel();
        fb.animations = Object.values(createFallbackClips());
        fb.userData.isFallback = true;

        return fb;
    }
}
