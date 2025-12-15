
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { createFallbackModel } from "./fallback_model.js";
import { createFallbackClips } from "./fallback_anims.js";

const loader = new GLTFLoader();

export async function loadPlayerModel(race = "human") {
    if (race === "human") {
        try {
            // Updated path to match assets_tree.txt
            const idleGLB = await loader.loadAsync("/assets/models/races/human/human_idle.glb");
            const group = idleGLB.scene;
            group.scale.set(0.01, 0.01, 0.01);
            group.position.y = -0.9;
            group.traverse(obj => {
                if (obj.isMesh) {
                    obj.castShadow = true;
                    obj.receiveShadow = true;
                }
            });
            const anims = {};
            if (idleGLB.animations.length > 0) anims.idle = idleGLB.animations[0];
            
            async function loadAnim(name, path) {
                try {
                    const glb = await loader.loadAsync(path);
                    if (glb.animations.length > 0) anims[name] = glb.animations[0];
                } catch (err) {
                    console.warn(`[AnimLoader] Missing file: ${path}`);
                }
            }
            
            // Updated paths
            await loadAnim("walk",   "/assets/models/races/human/human_walk.glb");
            await loadAnim("run",    "/assets/models/races/human/human_run.glb");
            await loadAnim("attack", "/assets/models/races/human/human_attack.glb");
            
            group.animations = anims;
            return group;
        } catch (err) {
            console.error("[AnimLoader] Human GLB failed → fallback:", err);
        }
    }
    const fallback = createFallbackModel();
    fallback.animations = Object.values(createFallbackClips());
    return fallback;
}

export async function loadMonsterModel(family = "wolf") {
    try {
        // Updated path to match assets_tree.txt
        const glb = await loader.loadAsync("/assets/models/monsters/wolf/wolf.glb");
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
        const fb = createFallbackModel();
        fb.animations = Object.values(createFallbackClips());
        fb.userData.isFallback = true;
        return fb;
    }
}
