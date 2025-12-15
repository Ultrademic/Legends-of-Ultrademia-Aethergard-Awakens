import * as THREE from "three";
import { scene, camera } from "../../core/renderer.js";
import { player } from "../characters/player.js";
import { spawnMonster } from "../ai/monster_spawning.js";
import { createNameplate } from "../ui/nameplates.js";
import { loadVillage } from "./zone_village.js";

export async function loadElvenRuins() {
    console.log("%c[Zone] Loading Elven Ruins...", "color:cyan");

    const toRemove = [];
    for (const obj of scene.children) {
        if (obj === player.group || obj === camera || obj.keep) continue;
        toRemove.push(obj);
    }
    toRemove.forEach(o => scene.remove(o));

    const ambient = new THREE.AmbientLight(0x88ccff, 0.55);
    scene.add(ambient);

    const directional = new THREE.DirectionalLight(0xaadcff, 0.85);
    directional.position.set(8, 14, 6);
    directional.castShadow = true;
    scene.add(directional);

    const ground = new THREE.Mesh(
        new THREE.BoxGeometry(50, 0.5, 50),
        new THREE.MeshLambertMaterial({ color: 0x2b3b26 })
    );
    ground.position.set(0, -0.25, 0);
    ground.receiveShadow = true;
    scene.add(ground);

    const platform = new THREE.Mesh(
        new THREE.CylinderGeometry(10, 10, 0.6, 32),
        new THREE.MeshLambertMaterial({ color: 0x8ea4b8 })
    );
    platform.position.set(0, 0, 0);
    scene.add(platform);

    function createPillar(rot = 0, broken = false) {
        const h = broken ? 2 : 4.5;
        const geo = new THREE.CylinderGeometry(0.6, 0.6, h, 12);
        const mat = new THREE.MeshLambertMaterial({ color: 0xbdd1e6 });
        const pillar = new THREE.Mesh(geo, mat);
        pillar.rotation.y = rot;
        pillar.position.set(Math.cos(rot) * 8, h / 2, Math.sin(rot) * 8);
        return pillar;
    }

    for (let i = 0; i < 6; i++) {
        const isBroken = Math.random() > 0.5;
        scene.add(createPillar(i * (Math.PI / 3), isBroken));
    }

    function createCrystal(x, z) {
        const geo = new THREE.ConeGeometry(0.8, 2.5, 6);
        const mat = new THREE.MeshLambertMaterial({
            color: 0x66d8ff,
            emissive: 0x1188aa,
            emissiveIntensity: 0.4
        });
        const c = new THREE.Mesh(geo, mat);
        c.position.set(x, 1.25, z);
        scene.add(c);
    }

    createCrystal(4, 4);
    createCrystal(-4, -5);
    createCrystal(-6, 5);
    createCrystal(6, -3);

    const guardian = new THREE.Mesh(
        new THREE.SphereGeometry(0.9, 16, 16),
        new THREE.MeshLambertMaterial({ color: 0xcfefff, opacity: 0.7, transparent: true })
    );
    guardian.position.set(0, 1.3, -7);
    guardian.isNPC = true;
    guardian.npcName = "Ruins Guardian";
    scene.add(guardian);
    createNameplate(guardian, "Ruins Guardian");

    if (player.group) {
        player.group.position.set(0, 0, 5);
    }

    if (camera && player.group) {
        camera.position.set(
            player.group.position.x,
            6,
            player.group.position.z + 12
        );
        camera.lookAt(player.group.position);
    }

    const wolfConfig = {
        family: "wolf",
        name: "Ruins Wolf",
        level: 3,
        maxHp: 34,
        attackPower: 6,
        attackCooldown: 1.3,
        attackRange: 1.5,
        moveSpeed: 3.7,
        aggressive: false,
        aggroRange: 6,
        leashRange: 14,
        xpReward: 24,
        adenaDrop: { min: 6, max: 14 },
        drops: [
            { name: "Wolf Fur", chance: 0.20, count: 1 },
            { name: "Wolf Fang", chance: 0.10, count: 1 }
        ]
    };

    const points = [{ x: 10, z: -4 }, { x: -12, z: -3 }, { x: -6, z: 10 }, { x: 8, z: 9 }];
    for (const p of points) {
        try { await spawnMonster(wolfConfig, p.x, p.z); } catch (err) {}
    }

    const portalGeo = new THREE.RingGeometry(1.5, 2.1, 32);
    const portalMat = new THREE.MeshBasicMaterial({ color: 0x66ccff, side: THREE.DoubleSide });
    const portal = new THREE.Mesh(portalGeo, portalMat);
    portal.position.set(0, 1.5, 12);
    portal.rotation.x = Math.PI / 2;
    portal.name = "portal_village";
    scene.add(portal);
    createNameplate(portal, "Portal: Village");

    const checkPortal = () => {
        if (!player.group) return;
        const dx = player.group.position.x - portal.position.x;
        const dz = player.group.position.z - portal.position.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < 2.2) loadVillage();
    };
    setInterval(checkPortal, 200);
}