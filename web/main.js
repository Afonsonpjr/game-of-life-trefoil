import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// =========================
// Configuraç¡¡ö¡¡¡es
// =========================
const N = 40;
const CELL_SIZE = 0.15;
const TUBE_RADIUS = 0.4;
const FPS_DEFAULT = 30;

let grid = [];
let nextGrid = [];
let running = false;
let fps = FPS_DEFAULT;
let lastTime = 0;
let accumulator = 0;
let aliveCount = 0;
let currentTheme = 'classic';
let currentPattern = 'random';

// Temas de cores
const themes = {
  classic: { alive: 0x00ff00, dead: 0x111111, bg: 0x000000 },
  neon: { alive: 0x00ffff, dead: 0x0a0a0a, bg: 0x000000 },
  fire: { alive: 0xff4500, dead: 0x1a0a00, bg: 0x050000 },
  ocean: { alive: 0x00bfff, dead: 0x001a33, bg: 0x00001a },
  purple: { alive: 0xbf00ff, dead: 0x1a001a, bg: 0x0a000a }
};

// Padrö¡¡¡es iniciais
const patterns = {
  random: (i, j) => Math.random() < 0.15,
  glider: (i, j) => {
    const glider = [[0,1],[1,2],[2,0],[2,1],[2,2]];
    return glider.some(([di,dj]) => i === di && j === dj);
  },
  blinker: (i, j) => j === 20 && (i === 19 || i === 20 || i === 21),
  beacon: (i, j) => {
    return ((i === 18 || i === 19) && (j === 18 || j === 19)) ||
           ((i === 21 || i === 22) && (j === 21 || j === 22));
  },
  rpentomino: (i, j) => {
    const r = [[1,2],[2,1],[2,2],[2,3],[3,2]];
    return r.some(([di,dj]) => i === di && j === dj);
  }
};

// =========================
// Cena Three.js
// =========================
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(themes[currentTheme].bg);

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
// Geometria do nó trevo
// =========================
function trefoilPoint(t, phi) {
  const x0 = Math.sin(t) + 2 * Math.sin(2 * t);
  const y0 = Math.cos(t) - 2 * Math.cos(2 * t);
  const z0 = -Math.sin(3 * t);

  const dt = 0.001;
  const x1 = Math.sin(t + dt) + 2 * Math.sin(2 * (t + dt));
  const y1 = Math.cos(t + dt) - 2 * Math.cos(2 * (t + dt));
  const z1 = -Math.sin(3 * (t + dt));

  let tx = (x1 - x0) / dt;
  let ty = (y1 - y0) / dt;
  let tz = (z1 - z0) / dt;
  const normT = Math.sqrt(tx * tx + ty * ty + tz * tz);
  tx /= normT; ty /= normT; tz /= normT;

  let nx = ty;
  let ny = tz;
  let nz = tx;
  const normN = Math.sqrt(nx * nx + ny * ny + nz * nz) + 1e-8;
  nx /= normN; ny /= normN; nz /= normN;

  const X = x0 + TUBE_RADIUS * nx * Math.cos(phi);
  const Y = y0 + TUBE_RADIUS * ny * Math.cos(phi);
  const Z = z0 + TUBE_RADIUS * nz * Math.cos(phi);

  return new THREE.Vector3(X, Y, Z);
}

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
// Cé¡¡lulas
// =========================
const cellGeometry = new THREE.BoxGeometry(CELL_SIZE, CELL_SIZE, CELL_SIZE);
let cellMaterialAlive = new THREE.MeshStandardMaterial({ color: themes[currentTheme].alive, roughness: 0.4 });
let cellMaterialDead = new THREE.MeshStandardMaterial({ color: themes[currentTheme].dead, roughness: 0.8 });

const cellMeshes = [];

function initGrid(pattern = 'random') {
  // Limpar meshes antigos
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (cellMeshes[i] && cellMeshes[i][j]) {
        scene.remove(cellMeshes[i][j]);
      }
    }
  }
  cellMeshes.length = 0;

  grid = [];
  nextGrid = [];
  aliveCount = 0;

  for (let i = 0; i < N; i++) {
    grid[i] = [];
    nextGrid[i] = [];
    cellMeshes[i] = [];
    for (let j = 0; j < N; j++) {
      const alive = patterns[pattern] ? patterns[pattern](i, j) : Math.random() < 0.15;
      grid[i][j] = alive ? 1 : 0;
      nextGrid[i][j] = 0;
      if (alive) aliveCount++;

      const mesh = new THREE.Mesh(cellGeometry, alive ? cellMaterialAlive : cellMaterialDead);
      mesh.position.copy(positions[i][j]);
      scene.add(mesh);
      cellMeshes[i][j] = mesh;
    }
  }
  updateStats();
}

// =========================
// Regras do Jogo da Vida
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
  let newAliveCount = 0;
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
      if (nextGrid[i][j] === 1) newAliveCount++;
    }
  }
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      grid[i][j] = nextGrid[i][j];
      const alive = grid[i][j] === 1;
      cellMeshes[i][j].material = alive ? cellMaterialAlive : cellMaterialDead;
    }
  }
  aliveCount = newAliveCount;
  updateStats();
}

// =========================
// UI e Stats
// =========================
function updateStats() {
  const statsEl = document.getElementById('stats');
  if (statsEl) {
    statsEl.textContent = `Cé¡¡lulas vivas: ${aliveCount}`;
  }
}

function applyTheme(themeName) {
  currentTheme = themeName;
  const theme = themes[themeName];
  scene.background = new THREE.Color(theme.bg);
  cellMaterialAlive.dispose();
  cellMaterialDead.dispose();
  cellMaterialAlive = new THREE.MeshStandardMaterial({ color: theme.alive, roughness: 0.4 });
  cellMaterialDead = new THREE.MeshStandardMaterial({ color: theme.dead, roughness: 0.8 });
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const alive = grid[i][j] === 1;
      cellMeshes[i][j].material = alive ? cellMaterialAlive : cellMaterialDead;
    }
  }
}

// =========================
// Loop
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
// Event Listeners
// =========================
document.getElementById('btnStart').addEventListener('click', () => { running = true; });
document.getElementById('btnPause').addEventListener('click', () => { running = false; });
document.getElementById('btnReset').addEventListener('click', () => {
  running = false;
  initGrid(currentPattern);
});
document.getElementById('speed').addEventListener('input', (e) => {
  fps = parseInt(e.target.value, 10);
});
document.getElementById('theme').addEventListener('change', (e) => {
  applyTheme(e.target.value);
});
document.getElementById('pattern').addEventListener('change', (e) => {
  currentPattern = e.target.value;
  running = false;
  initGrid(currentPattern);
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Init
initGrid('random');
animate(0);
