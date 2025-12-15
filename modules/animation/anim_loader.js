// /modules/animation/anim_loader.js
// ULTRADEMIC ANIMATION LOADER — Race-aware, Human real GLB, others fallback-safe

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { createFallbackModel } from "./fallback_model.js";
import { createFallbackClips, animateFallbackHumanoid } from "./fallback_anims.js";
import { createFallbackWolf, createFallbackWolfClips, animateFallbackWolf } from "./fallback_wolf.js";

const loader = new GLTFLoader();

// ---------------------------------------------------------
//  LOAD PLAYER MODEL BY RACE
// ---------------------------------------------------------
export async function loadPlayerModel(race = "human") {

    // HUMAN — real working assets
    if (race === "human") {
        try {
            // Racing against a timeout to prevent hanging on missing assets
            const loadPromise = loader.loadAsync("/assets/models/races/human/human_idle.glb");
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error("Timeout")), 2000)
            );
            
            const idleGLB = await Promise.race([loadPromise, timeoutPromise]);
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
                   // console.warn(`[AnimLoader] Missing file: ${path}`);
                }
            }

            // load remaining animations
            await Promise.all([
                loadAnim("walk",   "/assets/models/races/human/human_walk.glb"),
                loadAnim("run",    "/assets/models/races/human/human_run.glb"),
                loadAnim("attack", "/assets/models/races/human/human_attack.glb")
            ]);

            group.animations = anims;
            return group;

        } catch (err) {
            console.warn("[AnimLoader] Human GLB failed or timed out → using fallback.");
        }
    }

    // ---------------------------------------------------------
    // FALLBACK MODEL (Elf, Dark Elf, or failed Human)
    // ---------------------------------------------------------
    const fallback = createFallbackModel();
    fallback.userData.race = race;
    
    // Wire up fallback animation system
    fallback.animations = createFallbackClips();
    fallback.userData.animate = animateFallbackHumanoid;
    
    return fallback;
}

// ---------------------------------------------------------
//  MONSTER LOADER
// ---------------------------------------------------------
export async function loadMonsterModel(family = "wolf") {
    try {
        // Standardized to lowercase "models"
        const loadPromise = loader.loadAsync(`/assets/models/monsters/${family}/${family}.glb`);
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Timeout")), 1000)
        );

        const glb = await Promise.race([loadPromise, timeoutPromise]);
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

        return model;

    } catch (err) {
        // console.warn(`[AnimLoader] Monster '${family}' missing → using fallback.`);

        if (family.includes("wolf")) {
            const wolf = createFallbackWolf();
            wolf.animations = createFallbackWolfClips();
            wolf.userData.animate = animateFallbackWolf;
            return wolf;
        }

        // Generic fallback for unknown monsters
        const fb = createFallbackModel();
        fb.children[0].material.color.setHex(0xff0000); // Red tint for generic enemy
        fb.animations = createFallbackClips();
        fb.userData.animate = animateFallbackHumanoid;
        fb.userData.isFallback = true;

        return fb;
    }
}