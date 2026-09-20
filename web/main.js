import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// =========================
// Configurações
// =========================
const N = 40; // grid N x N
const CELL_SIZE = 0.15;
const TUBE_RADIUS = 0.4;
const FPS_DEFAULT = 30;

let grid = [];
let nextGrid = [];
let running = false;
let fps = FPS_DEFAULT;
let lastTime = 0;
let accumulator = 0;

// =========================
// Cena Three.js
// =========================
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(8, 6, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Luzes
const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// =========================
// Geometria do nó trevo (tubo)
// =========================
function trefoilPoint(t, phi) {
  // Curva central
  const x0 = Math.sin(t) + 2 * Math.sin(2 * t);
  const y0 = Math.cos(t) - 2 * Math.cos(2 * t);
  const z0 = -Math.sin(3 * t);

  // Derivada numérica para tangente
  const dt = 0.001;
  const x1 = Math.sin(t + dt) + 2 * Math.sin(2 * (t + dt));
  const y1 = Math.cos(t + dt) - 2 * Math.cos(2 * (t + dt));
  const z1 = -Math.sin(3 * (t + dt));

  let tx = (x1 - x0) / dt;
  let ty = (y1 - y0) / dt;
  let tz = (z1 - z0) / dt;
  const normT = Math.sqrt(tx * tx + ty * ty + tz * tz);
  tx /= normT; ty /= normT; tz /= normT;

  // Normal aproximada
  let nx = ty * 1 - tz * 0;
  let ny = tz * 1 - tx * 0;
  let nz = tx * 1 - ty * 0;
  const normN = Math.sqrt(nx * nx + ny * ny + nz * nz) + 1e-8;
  nx /= normN; ny /= normN; nz /= normN;

  // Ponto no tubo
  const X = x0 + TUBE_RADIUS * nx * Math.cos(phi);
  const Y = y0 + TUBE_RADIUS * ny * Math.cos(phi);
  const Z = z0 + TUBE_RADIUS * nz * Math.cos(phi);

  return new THREE.Vector3(X, Y, Z);
}

// Precomputar posições do grid mapeado no tubo
const positions = [];
for (let i = 0; i < N; i++) {
  positions[i] = [];
  const t = (i / N) * Math.PI * 2;
  for (let j = 0; j < N; j++) {
    const phi = (j / N) * Math.PI * 2;
    positions[i][j] = trefoilPoint(t, phi);
  }
}

// =========================
// Células (cubos)
// =========================
const cellGeometry = new THREE.BoxGeometry(CELL_SIZE, CELL_SIZE, CELL_SIZE);
const cellMaterialAlive = new THREE.MeshStandardMaterial({ color: 0x00ff00, roughness: 0.4 });
const cellMaterialDead = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });

const cellMeshes = [];

function initGrid() {
  grid = [];
  nextGrid = [];
  for (let i = 0; i < N; i++) {
    grid[i] = [];
    nextGrid[i] = [];
    cellMeshes[i] = [];
    for (let j = 0; j < N; j++) {
      const alive = Math.random() < 0.15;
      grid[i][j] = alive ? 1 : 0;
      nextGrid[i][j] = 0;

      const mesh = new THREE.Mesh(cellGeometry, alive ? cellMaterialAlive : cellMaterialDead);
      mesh.position.copy(positions[i][j]);
      scene.add(mesh);
      cellMeshes[i][j] = mesh;
    }
  }
}

// =========================
// Regras do Jogo da Vida (toroidal)
// =========================
function countNeighbors(i, j) {
  let sum = 0;
  for (let di = -1; di <= 1; di++) {
    for (let dj = -1; dj <= 1; dj++) {
      if (di === 0 && dj === 0) continue;
      const ni = (i + di + N) % N;
      const nj = (j + dj + N) % N;
      sum += grid[ni][nj];
    }
  }
  return sum;
}

function step() {
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const neighbors = countNeighbors(i, j);
      const alive = grid[i][j] === 1;
      if (alive && (neighbors === 2 || neighbors === 3)) {
        nextGrid[i][j] = 1;
      } else if (!alive && neighbors === 3) {
        nextGrid[i][j] = 1;
      } else {
        nextGrid[i][j] = 0;
      }
    }
  }
  // Swap
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      grid[i][j] = nextGrid[i][j];
      const alive = grid[i][j] === 1;
      cellMeshes[i][j].material = alive ? cellMaterialAlive : cellMaterialDead;
    }
  }
}

// =========================
// Loop de animação
// =========================
function animate(time) {
  requestAnimationFrame(animate);

  if (running) {
    if (!lastTime) lastTime = time;
    const delta = time - lastTime;
    lastTime = time;
    accumulator += delta;

    const stepInterval = 1000 / fps;
    while (accumulator >= stepInterval) {
      step();
      accumulator -= stepInterval;
    }
  } else {
    lastTime = time;
  }

  controls.update();
  renderer.render(scene, camera);
}

// =========================
// UI
// =========================
document.getElementById('btnStart').addEventListener('click', () => {
  running = true;
});
document.getElementById('btnPause').addEventListener('click', () => {
  running = false;
});
document.getElementById('btnReset').addEventListener('click', () => {
  running = false;
  // Remove meshes antigos
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      scene.remove(cellMeshes[i][j]);
    }
  }
  cellMeshes.length = 0;
  initGrid();
});
document.getElementById('speed').addEventListener('input', (e) => {
  fps = parseInt(e.target.value, 10);
});

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Init
initGrid();
animate(0);
