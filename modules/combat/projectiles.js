
import * as THREE from "three";
import { scene } from "../../core/renderer.js";

const particles = [];

export function spawnHitEffect(position, type = 'physical') {
    if (!position) return;

    const count = type === 'blood' ? 8 : 12;
    const color = getColorForType(type);
    
    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const material = new THREE.MeshBasicMaterial({ 
        color: color, 
        transparent: true, 
        opacity: 1.0 
    });

    for (let i = 0; i < count; i++) {
        const mesh = new THREE.Mesh(geometry, material.clone());
        
        mesh.position.copy(position);
        mesh.position.x += (Math.random() - 0.5) * 0.5;
        mesh.position.y += (Math.random() - 0.5) * 0.5 + 1.0; 
        mesh.position.z += (Math.random() - 0.5) * 0.5;

        const velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4 + 2, 
            (Math.random() - 0.5) * 4
        );

        scene.add(mesh);

        particles.push({
            mesh,
            velocity,
            life: 1.0, 
            maxLife: 1.0
        });
    }
}

function getColorForType(type) {
    switch (type) {
        case 'physical': return 0xffffaa; 
        case 'magic': return 0x00ffff;    
        case 'blood': return 0xaa0000;    
        case 'heal': return 0x00ff00;     
        case 'crit': return 0xffaa00;     
        default: return 0xffffff;
    }
}

export function updateEffects(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= dt;

        if (p.life <= 0) {
            scene.remove(p.mesh);
            if (p.mesh.geometry) p.mesh.geometry.dispose();
            if (p.mesh.material) p.mesh.material.dispose();
            particles.splice(i, 1);
            continue;
        }

        p.velocity.y -= 9.8 * dt; 
        p.mesh.position.addScaledVector(p.velocity, dt);
        
        p.mesh.rotation.x += p.velocity.z * dt;
        p.mesh.rotation.y += p.velocity.x * dt;

        p.mesh.material.opacity = p.life / p.maxLife;
        p.mesh.scale.setScalar(p.life / p.maxLife);
    }
}
