// /modules/zones/zone_village.js
// GLADEON VILLAGE — Starter zone for Ultrademia
// Clean, synced with MonsterStats + new combat + new player system

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.168.0/build/three.module.js";

import { scene, camera } from "../../core/renderer.js";
import { player } from "../characters/player.js";

import { spawnMonster } from "../ai/monster_spawning.js";
import { createNameplate } from "../ui/nameplates.js";

import { initQuests } from "../progression/starter_zone_quests.js";

// =====================================================
// LOAD VILLAGE
// =====================================================
export async function loadVillage() {
    console.log("%c[Zone] Loading Gladeon Village...", "color:cyan");

    // Initialize starter quests (safe to call every load)
    initQuests();

    // -------------------------------------------------
    // CLEAR SCENE — keep camera + player
    // -------------------------------------------------
    const toRemove = [];
    for (const obj of scene.children) {
        if (obj === camera || obj === player.group) continue;
        toRemove.push(obj);
    }
    toRemove.forEach(o => scene.remove(o));

    // -------------------------------------------------
    // GROUND
    // -------------------------------------------------
    const ground = new THREE.Mesh(
        new THREE.BoxGeometry(40, 0.2, 40),
        new THREE.MeshLambertMaterial({ color: 0x3f7f3f })
    );
    ground.position.set(0, -0.1, 0);
    ground.receiveShadow = true;
    scene.add(ground);

    // -------------------------------------------------
    // TREES
    // -------------------------------------------------
    for (let i = 0; i < 10; i++) {
        const trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.3, 1.6, 6),
            new THREE.MeshLambertMaterial({ color: 0x5c3b1e })
        );

        const crown = new THREE.Mesh(
            new THREE.SphereGeometry(0.9, 12, 12),
            new THREE.MeshLambertMaterial({ color: 0x2f8f4f })
        );

        const tree = new THREE.Group();
        trunk.position.y = 0.8;
        crown.position.y = 1.7;

        tree.add(trunk);
        tree.add(crown);

        const x = Math.random() * 32 - 16;
        const z = Math.random() * 32 - 16;

        if (Math.abs(x) < 4 && Math.abs(z) < 4) continue;

        tree.position.set(x, 0, z);
        scene.add(tree);
    }

    // -------------------------------------------------
    // NPC: VILLAGE ELDER
    // -------------------------------------------------
    const elder = new THREE.Mesh(
        new THREE.SphereGeometry(0.6, 16, 16),
        new THREE.MeshLambertMaterial({ color: 0xffe0a0, emissive: 0x444400 })
    );
    elder.position.set(0, 0.6, -5);
    elder.isNPC = true;
    elder.npcName = "Village Elder";
    elder.questGiver = true;

    scene.add(elder);
    createNameplate(elder, "Village Elder [L1 Quest]");

    // -------------------------------------------------
    // PLAYER SPAWN
    // -------------------------------------------------
    if (player.group) {
        player.group.position.set(0, 0, 2);
    }

    // -------------------------------------------------
    // CAMERA
    // -------------------------------------------------
    if (camera && player.group) {
        camera.position.set(
            player.group.position.x,
            player.group.position.y + 6,
            player.group.position.z + 10
        );
        camera.lookAt(player.group.position);
    }

    // -------------------------------------------------
    // MONSTERS: GLADEON WOLVES
    // Now tuned with MonsterStats defaults
    // -------------------------------------------------
    const wolfConfig = {
        family: "wolf",
        name: "Gladeon Wolf",
        level: 2,

        // Stats overridden OR left for MonsterStats to fill
        maxHp: 28,
        attackPower: 5,
        attackCooldown: 1.4,
        attackRange: 1.4,
        moveSpeed: 3.2,

        aggressive: false,
        aggroRange: 5,
        leashRange: 14,

        xpReward: 20,

        adenaDrop: { min: 4, max: 10 },

        drops: [
            { name: "Wolf Claw", chance: 0.20, count: 1 },
            { name: "Wolf Fang", chance: 0.10, count: 1 }
        ]
    };

    const spawnPoints = [
        { x: 6, z: 6 },
        { x: -7, z: 4 },
        { x: 4, z: -6 },
        { x: -5, z: -5 },
        { x: 9, z: -3 }
    ];

    for (const p of spawnPoints) {
        try {
            await spawnMonster(wolfConfig, p.x, p.z);
        } catch (err) {
            console.error("Wolf failed to spawn:", err);
        }
    }

    console.log("%c[Zone] Gladeon Village ready.", "color:lime");
}
