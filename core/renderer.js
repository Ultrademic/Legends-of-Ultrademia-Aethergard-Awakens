import * as THREE from "three";

export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x00000a);
scene.fog = new THREE.FogExp2(0x00000a, 0.0008);

export const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1.6, 5);

export const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: "high-performance"
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.8;

// REMOVED: document.body.appendChild(renderer.domElement);
// React GameCanvas component handles the DOM placement.

window.scene = scene;
window.camera = camera;
window.renderer = renderer;

// LIGHTING
const ambientLight = new THREE.AmbientLight(0x404060, 0.6);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0x8fbce4, 1.4);
sunLight.position.set(15, 25, 10);
sunLight.castShadow = true;
sunLight.shadow.mapSize.set(2048, 2048);
scene.add(sunLight);

// PARTICLES
const particleCount = 4000;
const geom = new THREE.BufferGeometry();
const pos = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i += 3) {
  pos[i]     = (Math.random() - 0.5) * 80;
  pos[i + 1] = Math.random() * 40;
  pos[i + 2] = (Math.random() - 0.5) * 80;
}

geom.setAttribute("position", new THREE.BufferAttribute(pos, 3));

const particles = new THREE.Points(
  geom,
  new THREE.PointsMaterial({
    color: 0x00ffff,
    size: 0.12,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
  })
);

scene.add(particles);

function drift() {
  particles.rotation.y += 0.00008;
  requestAnimationFrame(drift);
}
drift();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

console.log("%c[Renderer] Aethergard renderer initialized.", "color:cyan");

export function renderFrame() {
    renderer.render(scene, camera);
}