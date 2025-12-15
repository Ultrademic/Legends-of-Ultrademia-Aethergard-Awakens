
import * as THREE from "three";

export function createFallbackModel() {
    const group = new THREE.Group();
    group.userData.isFallback = true;

    const raceColors = {
        human: 0xff9999,
        elf: 0x99ffdd,
        dark_elf: 0x7777ff,
        default: 0xffffff
    };

    const race = group.userData.race || "default";
    const tint = raceColors[race] || raceColors.default;

    const torso = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 1.2, 0.4),
        new THREE.MeshStandardMaterial({ color: tint, roughness: 0.4 })
    );
    torso.position.y = 1.4;
    torso.castShadow = true;
    torso.receiveShadow = true;
    group.add(torso);

    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.35, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 })
    );
    head.position.y = 2.2;
    group.add(head);

    const armGeo = new THREE.BoxGeometry(0.2, 0.8, 0.2);
    const armMat = new THREE.MeshStandardMaterial({ color: tint });
    const leftArm = new THREE.Mesh(armGeo, armMat);
    leftArm.position.set(-0.55, 1.4, 0);
    group.add(leftArm);
    const rightArm = new THREE.Mesh(armGeo, armMat);
    rightArm.position.set(0.55, 1.4, 0);
    group.add(rightArm);

    const legGeo = new THREE.BoxGeometry(0.25, 1, 0.25);
    const legMat = new THREE.MeshStandardMaterial({ color: tint * 0.8 });
    const leftLeg = new THREE.Mesh(legGeo, legMat);
    leftLeg.position.set(-0.25, 0.5, 0);
    group.add(leftLeg);
    const rightLeg = new THREE.Mesh(legGeo, legMat);
    rightLeg.position.set(0.25, 0.5, 0);
    group.add(rightLeg);

    group.castShadow = true;
    group.receiveShadow = true;
    group.fallback = true;
    group.animations = []; 

    return group;
}
