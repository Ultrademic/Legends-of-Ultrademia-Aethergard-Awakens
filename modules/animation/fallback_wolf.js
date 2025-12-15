
import * as THREE from "three";

export function createFallbackWolf() {
    const wolf = new THREE.Group();
    wolf.userData.isFallback = true;

    const body = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.7, 0.5),
        new THREE.MeshStandardMaterial({ color: 0xaaaaaa })
    );
    body.position.y = 0.6;
    wolf.add(body);

    const head = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.6, 0.5),
        new THREE.MeshStandardMaterial({ color: 0xbbbbbb })
    );
    head.position.set(0.9, 0.9, 0);
    wolf.add(head);

    const legGeo = new THREE.BoxGeometry(0.2, 0.8, 0.2);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const legs = [];
    const positions = [[-0.6, 0.2,  0.18], [-0.6, 0.2, -0.18], [ 0.4, 0.2,  0.18], [ 0.4, 0.2, -0.18]];
    positions.forEach(p => {
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.set(p[0], p[1], p[2]);
        wolf.add(leg);
        legs.push(leg);
    });

    const tail = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.3, 0.8),
        new THREE.MeshStandardMaterial({ color: 0x777777 })
    );
    tail.position.set(-0.9, 1.0, 0);
    tail.rotation.z = Math.PI / 5;
    wolf.add(tail);

    wolf.childrenList = { body, head, legs, tail };
    return wolf;
}

export function createFallbackWolfClips() {
    return {
        idle: {
            name: "idle",
            loop: true,
            duration: Infinity,
            update(wolf, t) {
                const { head, tail } = wolf.childrenList;
                if (!head) return;
                head.position.y += Math.sin(t * 2) * 0.01;
                tail.rotation.z = Math.sin(t * 3) * 0.2 + Math.PI / 5;
            }
        },
        moving: {
            name: "moving",
            loop: true,
            duration: Infinity,
            update(wolf, t) {
                const { legs } = wolf.childrenList;
                if (!legs) return;
                const swing = Math.sin(t * 10) * 0.4;
                const counter = Math.sin(t * 10 + Math.PI) * 0.4;
                legs[0].rotation.x = swing;
                legs[1].rotation.x = counter;
                legs[2].rotation.x = counter;
                legs[3].rotation.x = swing;
            }
        },
        attacking: {
            name: "attacking",
            loop: false,
            duration: 0.4,
            update(wolf, t) {
                const { head } = wolf.childrenList;
                if (!head) return;
                head.position.x += Math.sin(t * 20) * 0.07;
            }
        },
        dead: {
            name: "dead",
            loop: false,
            duration: Infinity,
            update(wolf, t) {
                wolf.rotation.z = Math.PI / 2;
                wolf.position.y = 0.05;
            }
        }
    };
}

export function animateFallbackWolf(wolf, dt, state) {
    if (!wolf || !wolf.userData.isFallback) return;
    wolf.userData._time = (wolf.userData._time || 0) + dt;
    const clips = wolf.animations;
    if (!clips) return;
    const clip = clips[state] || clips.idle;
    if (!clip || !clip.update) return;
    clip.update(wolf, wolf.userData._time);
}
