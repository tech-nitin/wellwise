import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { gsap } from 'gsap';
import './style.css';

const host = document.querySelector('#canvas');
const viewport = document.querySelector('#viewport');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x071116);
scene.fog = new THREE.Fog(0x071116, 20, 55);

const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);
camera.position.set(13, 8, 15);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.setClearColor(0x071116, 1);
host.appendChild(renderer.domElement);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(1, 1);
labelRenderer.domElement.className = 'label-layer';
viewport.appendChild(labelRenderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 42;
controls.target.set(0, -4, 0);

scene.add(new THREE.HemisphereLight(0xa8c4cf, 0x0b1319, 1.25));
const keyLight = new THREE.DirectionalLight(0xeaf8ff, 2.7);
keyLight.position.set(8, 16, 10);
scene.add(keyLight);
const rimLight = new THREE.PointLight(0x4ea7b7, 35, 38, 2);
rimLight.position.set(3, -6, 4);
scene.add(rimLight);

const world = new THREE.Group();
scene.add(world);
const geoGroup = new THREE.Group();
const wellGroup = new THREE.Group();
const rigGroup = new THREE.Group();
const detailGroup = new THREE.Group();
const labelGroup = new THREE.Group();
world.add(geoGroup, wellGroup, rigGroup, detailGroup, labelGroup);

const palettes = [
  { c: 0x5d4b40, edge: 0xb58b68, name: 'Top soil' },
  { c: 0x6d5b50, edge: 0xc4a88e, name: 'Shale' },
  { c: 0x725a4e, edge: 0xd1a785, name: 'Sandstone' },
  { c: 0x3e5359, edge: 0x6f909a, name: 'Siltstone' },
  { c: 0x284f5d, edge: 0x58a8b8, name: 'Target reservoir' },
  { c: 0x1b3641, edge: 0x4e8290, name: 'Basement' },
];
const formationMats = palettes.map((p, i) => new THREE.MeshStandardMaterial({ color: p.c, roughness: 1, transparent: true, opacity: i === 4 ? 0.58 : 0.48 }));
const edgeMats = palettes.map(p => new THREE.LineBasicMaterial({ color: p.edge, transparent: true, opacity: 0.26 }));

const layerHeight = 1.7;
const layerDepth = 4.4;
const layerWidth = 7.4;
const formations = [];
for (let i = 0; i < palettes.length; i++) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(layerWidth, layerHeight, layerDepth), formationMats[i]);
  mesh.position.set(0, 1 - i * layerHeight, 0);
  geoGroup.add(mesh);
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), edgeMats[i]);
  edges.position.copy(mesh.position);
  geoGroup.add(edges);
  formations.push(mesh);
}

// Fracture/strata lines for the engineering-visual style.
for (let i = 0; i < 22; i++) {
  const y = 0.6 - i * 0.44;
  const pts = [
    new THREE.Vector3(-3.7, y, 2.22),
    new THREE.Vector3(-1.7 + Math.sin(i * 1.4) * 0.6, y + 0.06 * Math.sin(i), 2.22),
    new THREE.Vector3(0.8, y - 0.04 * Math.cos(i), 2.22),
    new THREE.Vector3(3.7, y + 0.05 * Math.sin(i * 0.7), 2.22),
  ];
  const g = new THREE.BufferGeometry().setFromPoints(pts);
  detailGroup.add(new THREE.Line(g, new THREE.LineBasicMaterial({ color: 0x9db4b8, transparent: true, opacity: 0.1 })));
}

const trajectoryPoints = [
  new THREE.Vector3(0, 2.9, 0),
  new THREE.Vector3(0, 2.0, 0),
  new THREE.Vector3(0.02, 0.5, 0),
  new THREE.Vector3(0.08, -1.2, 0),
  new THREE.Vector3(0.22, -2.9, 0.02),
  new THREE.Vector3(0.5, -4.4, 0.1),
  new THREE.Vector3(1.0, -5.9, 0.25),
  new THREE.Vector3(1.9, -7.2, 0.42),
  new THREE.Vector3(3.0, -8.2, 0.58),
];
const curve = new THREE.CatmullRomCurve3(trajectoryPoints);
const wellMaterial = new THREE.MeshStandardMaterial({ color: 0x7dd8e8, emissive: 0x124d58, emissiveIntensity: 0.9, metalness: 0.2, roughness: 0.38, transparent: true, opacity: 0.92 });
const reservoirMaterial = new THREE.MeshStandardMaterial({ color: 0x1c5f70, emissive: 0x0d6570, emissiveIntensity: 0.7, transparent: true, opacity: 0.20, depthWrite: false, side: THREE.DoubleSide });
const reservoirShell = new THREE.Mesh(new THREE.BoxGeometry(layerWidth + 0.03, layerHeight + 0.03, layerDepth + 0.03), reservoirMaterial);
reservoirShell.position.copy(formations[4].position);
geoGroup.add(reservoirShell);
const boreholeWall = new THREE.Mesh(new THREE.TubeGeometry(curve, 180, 0.15, 12, false), new THREE.MeshPhysicalMaterial({ color: 0x6ed3de, transmission: 0.18, transparent: true, opacity: 0.16, roughness: 0.18, metalness: 0.1, depthWrite: false }));
wellGroup.add(boreholeWall);
const wellbore = new THREE.Mesh(new THREE.TubeGeometry(curve, 180, 0.085, 10, false), wellMaterial);
wellGroup.add(wellbore);

// Casing strings as nested shorter tubes.
const casingSpec = [
  { end: 0.38, radius: 0.28, color: 0xd8e3e6, opacity: 0.72 },
  { end: 0.63, radius: 0.22, color: 0xc2d0d4, opacity: 0.5 },
  { end: 0.84, radius: 0.17, color: 0xadc1c7, opacity: 0.34 },
];
const casings = [];
for (const spec of casingSpec) {
  const pts = curve.getPoints(75).slice(0, Math.floor(75 * spec.end));
  const c = new THREE.CatmullRomCurve3(pts);
  const mat = new THREE.MeshStandardMaterial({ color: spec.color, metalness: 0.75, roughness: 0.33, transparent: true, opacity: spec.opacity });
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(c, 100, spec.radius, 16, false), mat);
  wellGroup.add(mesh); casings.push(mesh);
}

// BHA / drill string segments.
const drillGroup = new THREE.Group();
const drillMat = new THREE.MeshStandardMaterial({ color: 0xd9e4e7, metalness: 0.88, roughness: 0.28 });
const darkMat = new THREE.MeshStandardMaterial({ color: 0x354a52, metalness: 0.72, roughness: 0.36 });
const toolMat = new THREE.MeshStandardMaterial({ color: 0x9eb6bb, metalness: 0.78, roughness: 0.34 });
for (let i = 0; i < 22; i++) {
  const t = i / 23 * 0.97;
  const p = curve.getPointAt(t);
  const q = curve.getPointAt(Math.min(1, t + 0.018));
  const seg = new THREE.Mesh(new THREE.CylinderGeometry(i > 17 ? 0.095 : 0.055, i > 17 ? 0.095 : 0.055, 0.55, 12), drillMat);
  seg.position.copy(p);
  seg.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), q.clone().sub(p).normalize());
  drillGroup.add(seg);
}
const bhaStations = [0.76, 0.81, 0.86, 0.91];
for (const t of bhaStations) {
  const p = curve.getPointAt(t); const q = curve.getPointAt(Math.min(1, t + 0.02));
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.42, 16), darkMat);
  collar.position.copy(p); collar.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), q.clone().sub(p).normalize());
  drillGroup.add(collar);
}
const bitT = curve.getPointAt(0.99);
const bit = new THREE.Mesh(new THREE.ConeGeometry(0.31, 0.72, 10), toolMat);
bit.position.copy(bitT);
bit.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), trajectoryPoints[trajectoryPoints.length - 1].clone().sub(trajectoryPoints[trajectoryPoints.length - 2]).normalize());
drillGroup.add(bit);
wellGroup.add(drillGroup);
// Tool-joint collars and a direction marker make the BHA read more like an engineering assembly.
for (let i = 3; i < 20; i += 3) {
  const t = i / 23 * 0.97;
  const p = curve.getPointAt(t); const q = curve.getPointAt(Math.min(1, t + 0.012));
  const joint = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.045, 16), darkMat);
  joint.position.copy(p);
  joint.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), q.clone().sub(p).normalize());
  drillGroup.add(joint);
}
const directionArrow = new THREE.Group();
const arrowShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.7, 8), new THREE.MeshBasicMaterial({ color: 0x77d9e6, transparent: true, opacity: 0.75 }));
arrowShaft.rotation.z = Math.PI / 2; arrowShaft.position.y = 0.35; directionArrow.add(arrowShaft);
const arrowHead = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.28, 10), new THREE.MeshBasicMaterial({ color: 0x77d9e6, transparent: true, opacity: 0.85 }));
arrowHead.rotation.z = -Math.PI / 2; arrowHead.position.x = 0.72; arrowHead.position.y = 0.35; directionArrow.add(arrowHead);
directionArrow.position.copy(curve.getPointAt(0.71)); directionArrow.position.z += 0.35;
detailGroup.add(directionArrow);

// Surface wellhead + mast.
const wellheadMat = new THREE.MeshStandardMaterial({ color: 0x9caeb4, metalness: 0.84, roughness: 0.3 });
const darkSteel = new THREE.MeshStandardMaterial({ color: 0x4e646b, metalness: 0.8, roughness: 0.38 });
const wellhead = new THREE.Group();
const whBase = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.53, 0.34, 20), darkSteel); whBase.position.y = 3.18; wellhead.add(whBase);
const whBody = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.72, 20), wellheadMat); whBody.position.y = 3.68; wellhead.add(whBody);
const flange = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.12, 20), wellheadMat); flange.position.y = 4.05; wellhead.add(flange);
wellGroup.add(wellhead);

const mast = new THREE.Group();
const mastMat = new THREE.MeshStandardMaterial({ color: 0x81979d, metalness: 0.82, roughness: 0.42 });
function beam(a, b, radius = 0.035) {
  const start = new THREE.Vector3(...a), end = new THREE.Vector3(...b);
  const v = end.clone().sub(start), len = v.length();
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, len, 8), mastMat);
  mesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v.normalize());
  return mesh;
}
const mastCorners = [[-1.25, 4.0, -0.75], [1.25, 4.0, -0.75], [-0.85, 10.0, -0.55], [0.85, 10.0, -0.55]];
mastCorners.forEach((_, i) => {});
for (let i = 0; i < 2; i++) {
  mast.add(beam(mastCorners[i], mastCorners[i + 2], 0.045));
  mast.add(beam([mastCorners[i][0], mastCorners[i][1], 0.75], [mastCorners[i + 2][0], mastCorners[i + 2][1], 0.55], 0.045));
}
for (let y = 4.6; y <= 9.4; y += 0.8) {
  mast.add(beam([-1.08, y, -0.68], [1.08, y, -0.68], 0.027));
  mast.add(beam([-0.92, y, -0.55], [0.92, y + 0.5, -0.55], 0.018));
}
mast.add(new THREE.Mesh(new THREE.BoxGeometry(4.3, 0.28, 2.1), new THREE.MeshStandardMaterial({ color: 0x1e2e34, metalness: 0.55, roughness: 0.7 })));
mast.children[mast.children.length - 1].position.y = 3.05;
rigGroup.add(mast);

const ring = new THREE.Mesh(new THREE.RingGeometry(0.19, 0.27, 24), new THREE.MeshBasicMaterial({ color: 0x7fe0eb, side: THREE.DoubleSide, transparent: true, opacity: 0.9 }));
ring.rotation.x = Math.PI / 2; ring.position.copy(curve.getPointAt(0.96));
detailGroup.add(ring);

const grid = new THREE.GridHelper(24, 48, 0x3a5660, 0x1d3139);
grid.position.set(0, 2.9, 0); world.add(grid);

const labels = [];
function addLabel(text, className, pos, offset = [0, 0]) {
  const div = document.createElement('div');
  div.className = `world-label ${className}`;
  div.textContent = text;
  div.style.transform = `translate(${offset[0]}px, ${offset[1]}px)`;
  const obj = new CSS2DObject(div);
  obj.position.copy(pos);
  labelGroup.add(obj); labels.push({ obj, div });
}
addLabel('Conductor / wellhead', 'label-amber', new THREE.Vector3(1.15, 3.85, 0.2));
addLabel('Surface casing', 'label-sand', new THREE.Vector3(1.0, 1.85, 0.35));
addLabel('Intermediate casing', 'label-sand', new THREE.Vector3(1.25, -0.4, 0.25));
addLabel('Directional BHA', 'label-blue', new THREE.Vector3(2.75, -7.1, 0.45));
addLabel('Target reservoir', 'label-blue', new THREE.Vector3(-3.0, -5.7, 0.9));
addLabel('4,120 m MD', 'label-blue', new THREE.Vector3(3.35, -8.05, 0.55));
addLabel('58° inclination', 'label-sand', new THREE.Vector3(1.65, -5.35, 0.35));

const stageData = {
  overview: { title: 'Preparing a conductor', desc: 'Prepare the conductor and surface connection before deeper drilling operations.', phase: 'Conductor', depth: 0, md: '0 m', tvd: '0 m', inc: '0°', azi: '0°', camera: [13, 8, 15], target: [0, -1.5, 0], drill: 0.25, casing: 0.7, formation: 0.47, labelStates: [1, 0, 0, 0, 0], status: 'Standby' },
  well: { title: 'Well section', desc: 'Review the planned well path, surface connection and primary wellbore geometry.', phase: 'Well section', depth: 1140, md: '4,120 m', tvd: '3,680 m', inc: '58°', azi: '142°', camera: [12, 5, 14], target: [0, -2.5, 0], drill: 0.4, casing: 0.85, formation: 0.42, labelStates: [1, 1, 0, 0, 0], status: 'Planned' },
  lithology: { title: 'Lithology review', desc: 'Compare the visible formation sequence and the reservoir interval along the planned path.', phase: 'Lithology', depth: 2890, md: '3,980 m', tvd: '3,570 m', inc: '56°', azi: '141°', camera: [14, 4, 10], target: [0, -3.3, 0], drill: 0.1, casing: 0.35, formation: 0.66, labelStates: [0, 1, 1, 0, 1], status: 'Review' },
  bha: { title: 'Directional BHA', desc: 'Inspect the bottom-hole assembly and directional components used to build the planned trajectory.', phase: 'Directional BHA', depth: 3680, md: '4,120 m', tvd: '3,680 m', inc: '58°', azi: '142°', camera: [8, -0.8, 10], target: [2.3, -6.2, 0.2], drill: 1, casing: 0.3, formation: 0.28, labelStates: [0, 0, 0, 1, 0], status: 'Active' },
  casing: { title: 'Surface & casing', desc: 'Review casing strings and the sealed wellhead connection across the construction stages.', phase: 'Casing', depth: 3330, md: '4,090 m', tvd: '3,650 m', inc: '57°', azi: '140°', camera: [11, 7, 15], target: [0, -2.6, 0], drill: 0.12, casing: 1, formation: 0.33, labelStates: [1, 1, 1, 0, 0], status: 'Set' },
  evaluation: { title: 'Evaluation & evidence review', desc: 'Final review state showing the construction sequence and target interval together.', phase: 'Evaluation', depth: 4120, md: '4,120 m', tvd: '3,680 m', inc: '58°', azi: '142°', camera: [12, 6, 15], target: [0.4, -3.5, 0], drill: 0.6, casing: 0.75, formation: 0.48, labelStates: [1, 1, 1, 1, 1], status: 'Verified' },
};
const stageOrder = Object.keys(stageData);
let currentStage = 'overview';
let activeTween = null;
let autoTimer = null;
let exploded = false;
let sectioned = false;

function setMetrics(data) {
  document.querySelector('#selectedTitle').textContent = data.title;
  document.querySelector('#selectedDescription').textContent = data.desc;
  document.querySelector('#phaseText').textContent = data.phase;
  document.querySelector('#depthValue').textContent = `${data.depth.toLocaleString()} m`;
  document.querySelector('#md').textContent = data.md;
  document.querySelector('#tvd').textContent = data.tvd;
  document.querySelector('#inc').textContent = data.inc;
  document.querySelector('#azi').textContent = data.azi;
  document.querySelector('#bhaStatus').textContent = data.status;
  document.querySelector('#hudStage').textContent = data.title;
}
function setMilestones(idx) {
  const el = document.querySelector('#milestones');
  el.innerHTML = stageOrder.map((key, i) => `<div class="milestone ${i <= idx ? 'done' : ''} ${i === idx ? 'current' : ''}"><i></i><span>${stageData[key].phase}</span></div>`).join('');
}

// --- Reference-sequence animation layer ---
const sequence = [
  { key: 'overview', label: '01  Surface setup', duration: 4200, camera: [13, 8, 15], target: [0, -1.2, 0], drill: 0.08, casing: 0.72, reservoir: 0.06, formation: 0.40 },
  { key: 'well', label: '02  Drill surface section', duration: 4800, camera: [11.5, 5.5, 14], target: [0, -2.0, 0], drill: 0.28, casing: 0.80, reservoir: 0.08, formation: 0.43 },
  { key: 'lithology', label: '03  Expose formation', duration: 5000, camera: [13.5, 2.5, 10.5], target: [0.2, -3.6, 0], drill: 0.56, casing: 0.44, reservoir: 0.22, formation: 0.58 },
  { key: 'bha', label: '04  Run directional BHA', duration: 6200, camera: [8.2, -0.3, 9.7], target: [2.3, -6.6, 0.2], drill: 1.0, casing: 0.32, reservoir: 0.30, formation: 0.28 },
  { key: 'casing', label: '05  Set casing strings', duration: 5000, camera: [10.8, 6.4, 14.7], target: [0, -2.8, 0], drill: 0.35, casing: 1.0, reservoir: 0.16, formation: 0.36 },
  { key: 'evaluation', label: '06  Final evaluation', duration: 5200, camera: [12, 6, 15], target: [0.4, -3.5, 0], drill: 0.82, casing: 0.78, reservoir: 0.34, formation: 0.48 },
];
let sequenceTimer = null;
let sequenceRunning = false;
let sequenceFrame = 0;
let sequenceStart = 0;
let sequenceProgress = 0;
const originalStageTimeline = stageOrder.map((key, i) => ({ key, t: i / (stageOrder.length - 1) }));

function applySequenceFrame(index, localProgress = 0) {
  const item = sequence[index];
  const next = sequence[Math.min(index + 1, sequence.length - 1)];
  const smooth = 0.5 - 0.5 * Math.cos(Math.PI * Math.max(0, Math.min(1, localProgress)));
  const current = {
    camera: item.camera.map((v, i) => v + ((next?.camera?.[i] ?? v) - v) * smooth),
    target: item.target.map((v, i) => v + ((next?.target?.[i] ?? v) - v) * smooth),
    drill: item.drill + ((next?.drill ?? item.drill) - item.drill) * smooth,
    casing: item.casing + ((next?.casing ?? item.casing) - item.casing) * smooth,
    reservoir: item.reservoir + ((next?.reservoir ?? item.reservoir) - item.reservoir) * smooth,
    formation: item.formation + ((next?.formation ?? item.formation) - item.formation) * smooth,
  };
  camera.position.set(...current.camera);
  controls.target.set(...current.target);
  formationMats.forEach(m => { m.opacity = current.formation; });
  drillGroup.userData.progress = current.drill;
  drillGroup.children.forEach((obj, i) => {
    obj.visible = (i / Math.max(1, drillGroup.children.length - 1)) <= current.drill + 0.02;
  });
  directionArrow.visible = current.drill > 0.56;
  boreholeWall.material.opacity = Math.min(0.25, 0.07 + current.drill * 0.13);
  casings.forEach((c, i) => { c.material.opacity = Math.max(0.05, current.casing - i * 0.08); });
  reservoirMaterial.opacity = current.reservoir;
  const stageIdx = Math.min(stageOrder.length - 1, Math.floor((index + smooth) + 0.0001));
  const stageKey = stageOrder[stageIdx];
  const data = stageData[stageKey];
  setMetrics(data);
  setMilestones(stageIdx);
  document.querySelectorAll('#stageNav > button').forEach(b => b.classList.toggle('active', b.dataset.stage === stageKey));
  const overall = (index + localProgress) / (sequence.length - 1);
  document.querySelector('#timeline').value = String(Math.round(overall * 100));
  document.querySelector('#stageIndex').textContent = `${String(stageIdx + 1).padStart(2, '0')} / 06`;
  const phaseLabel = document.querySelector('#sequenceLabel');
  if (phaseLabel) phaseLabel.textContent = item.label;
  const progressBar = document.querySelector('#sequenceProgress');
  if (progressBar) progressBar.style.width = `${Math.round(overall * 100)}%`;
}

function stopSequence() {
  sequenceRunning = false;
  if (sequenceTimer) cancelAnimationFrame(sequenceTimer);
  sequenceTimer = null;
}
function startSequence() {
  stopSequence();
  sequenceRunning = true;
  sequenceFrame = 0;
  sequenceStart = performance.now();
  const step = (now) => {
    if (!sequenceRunning) return;
    let elapsed = now - sequenceStart;
    let idx = sequenceFrame;
    while (idx < sequence.length - 1 && elapsed > sequence[idx].duration) {
      elapsed -= sequence[idx].duration;
      sequenceStart = now - elapsed;
      idx += 1;
      sequenceFrame = idx;
    }
    const duration = sequence[idx].duration;
    const local = Math.min(0.999, elapsed / duration);
    applySequenceFrame(idx, local);
    if (idx === sequence.length - 1 && elapsed >= duration) {
      applySequenceFrame(idx, 1);
      stopSequence();
      return;
    }
    sequenceTimer = requestAnimationFrame(step);
  };
  sequenceTimer = requestAnimationFrame(step);
}

function scrubSequence(percent) {
  stopSequence();
  const p = Math.max(0, Math.min(1, percent / 100));
  const scaled = p * (sequence.length - 1);
  const idx = Math.min(sequence.length - 1, Math.floor(scaled));
  applySequenceFrame(idx, scaled - idx);
}

function animateStage(key) {
  stopSequence();
  currentStage = key;
  const data = stageData[key];
  const idx = stageOrder.indexOf(key);
  document.querySelectorAll('#stageNav > button').forEach(b => b.classList.toggle('active', b.dataset.stage === key));
  document.querySelector('#stageIndex').textContent = `${String(idx + 1).padStart(2, '0')} / 06`;
  setMetrics(data); setMilestones(idx);
  if (activeTween) activeTween.kill();
  const state = { x: camera.position.x, y: camera.position.y, z: camera.position.z, tx: controls.target.x, ty: controls.target.y, tz: controls.target.z, opacity: formationMats[0].opacity, drill: drillGroup.userData.progress ?? 0.25, casing: casings[0].material.opacity, reservoir: reservoirMaterial.opacity };
  activeTween = gsap.to(state, {
    x: data.camera[0], y: data.camera[1], z: data.camera[2],
    tx: data.target[0], ty: data.target[1], tz: data.target[2],
    opacity: data.formation, drill: data.drill, casing: data.casing, reservoir: data.formation > 0.55 ? 0.28 : 0.10,
    duration: 1.1, ease: 'power2.inOut',
    onUpdate: () => {
      camera.position.set(state.x, state.y, state.z);
      controls.target.set(state.tx, state.ty, state.tz);
      formationMats.forEach(m => { m.opacity = state.opacity; });
      drillGroup.userData.progress = state.drill;
      drillGroup.children.forEach((obj, i) => { obj.visible = (i / Math.max(1, drillGroup.children.length - 1)) <= state.drill + 0.02; });
      directionArrow.visible = state.drill > 0.6;
      boreholeWall.material.opacity = Math.min(0.24, 0.08 + state.drill * 0.12);
      casings.forEach((c, i) => { c.material.opacity = Math.max(0.05, state.casing - i * 0.08); });
      reservoirMaterial.opacity = state.reservoir;
    }
  });
  labels.forEach((label, i) => gsap.to(label.div, { opacity: data.labelStates[i] ? 1 : 0.12, duration: 0.35 }));
  gsap.fromTo('#selectedTitle', { opacity: 0.3 }, { opacity: 1, duration: 0.45 });
}

function setView(view) {
  const map = {
    iso: [13, 8, 15],
    front: [0.2, 5.3, 17],
    top: [0, 18, 0.2],
  };
  if (!map[view]) return;
  gsap.to(camera.position, { x: map[view][0], y: map[view][1], z: map[view][2], duration: 0.8, ease: 'power2.inOut' });
  if (view === 'top') gsap.to(controls.target, { x: 0, y: -3.4, z: 0, duration: 0.8, ease: 'power2.inOut' });
  else if (view === 'front') gsap.to(controls.target, { x: 0.7, y: -3.0, z: 0, duration: 0.8, ease: 'power2.inOut' });
  else gsap.to(controls.target, { x: 0, y: -2.5, z: 0, duration: 0.8, ease: 'power2.inOut' });
}
function fitView() {
  gsap.to(camera.position, { x: 13, y: 8, z: 15, duration: 0.75, ease: 'power2.inOut' });
  gsap.to(controls.target, { x: 0, y: -2.5, z: 0, duration: 0.75, ease: 'power2.inOut' });
}
function toggleExplode() {
  exploded = !exploded;
  gsap.to(geoGroup.position, { x: exploded ? -0.55 : 0, duration: 0.55, ease: 'power2.inOut' });
  gsap.to(rigGroup.position, { y: exploded ? 0.35 : 0, duration: 0.55, ease: 'power2.inOut' });
  gsap.to(wellGroup.position, { x: exploded ? 0.35 : 0, duration: 0.55, ease: 'power2.inOut' });
}
function toggleSection() {
  sectioned = !sectioned;
  const z4 = sectioned ? 0.42 : 1;
  const z3 = sectioned ? 0.66 : 1;
  gsap.to(formations[4].scale, { z: z4, duration: 0.55, ease: 'power2.inOut' });
  gsap.to(formations[3].scale, { z: z3, duration: 0.55, ease: 'power2.inOut' });
  gsap.to(reservoirShell.scale, { z: z4, duration: 0.55, ease: 'power2.inOut' });
  const edges = geoGroup.children.filter(o => o.type === 'LineSegments');
  const targetY = formations[4].position.y;
  edges.forEach(edge => {
    if (Math.abs(edge.position.y - targetY) < 0.1) gsap.to(edge.scale, { z: z4, duration: 0.55, ease: 'power2.inOut' });
    if (Math.abs(edge.position.y - formations[3].position.y) < 0.1) gsap.to(edge.scale, { z: z3, duration: 0.55, ease: 'power2.inOut' });
  });
}

// UI hooks.
document.querySelectorAll('#stageNav > button').forEach(btn => btn.addEventListener('click', () => animateStage(btn.dataset.stage)));
document.querySelectorAll('[data-view]').forEach(btn => btn.addEventListener('click', () => setView(btn.dataset.view)));
document.querySelector('#fitBtn').addEventListener('click', fitView);
document.querySelector('#explodeBtn').addEventListener('click', toggleExplode);
document.querySelector('#sectionBtn').addEventListener('click', toggleSection);
document.querySelector('#zoomIn').addEventListener('click', () => gsap.to(camera, { zoom: Math.min(camera.zoom + 0.15, 2.5), duration: 0.25, onUpdate: () => camera.updateProjectionMatrix() }));
document.querySelector('#zoomOut').addEventListener('click', () => gsap.to(camera, { zoom: Math.max(camera.zoom - 0.15, 0.7), duration: 0.25, onUpdate: () => camera.updateProjectionMatrix() }));
document.querySelector('#opacity').addEventListener('input', e => formationMats.forEach((m, i) => m.opacity = Math.max(0.08, Number(e.target.value) - i * 0.015)));
document.querySelector('#gridToggle').addEventListener('change', e => grid.visible = e.target.checked);
document.querySelector('#labelsToggle').addEventListener('change', e => labelGroup.visible = e.target.checked);
document.querySelector('#resetBtn').addEventListener('click', () => animateStage(currentStage));
document.querySelector('#prevBtn').addEventListener('click', () => animateStage(stageOrder[Math.max(0, stageOrder.indexOf(currentStage) - 1)]));
document.querySelector('#nextBtn').addEventListener('click', () => animateStage(stageOrder[Math.min(stageOrder.length - 1, stageOrder.indexOf(currentStage) + 1)]));
document.querySelector('#timeline').addEventListener('input', e => scrubSequence(Number(e.target.value)));
function stopAuto() { if (autoTimer) clearInterval(autoTimer); autoTimer = null; }
document.querySelector('#autoBtn').addEventListener('click', () => {
  if (autoTimer) { stopAuto(); return; }
  let idx = stageOrder.indexOf(currentStage);
  autoTimer = setInterval(() => { idx = (idx + 1) % stageOrder.length; animateStage(stageOrder[idx]); }, 1900);
});
document.querySelector('#playBtn').addEventListener('click', () => {
  stopAuto();
  startSequence();
});
document.querySelector('#focusToggle').addEventListener('click', () => document.body.classList.toggle('focus-mode'));


const seqPlayBtn = document.querySelector('#sequencePlay');
if (seqPlayBtn) seqPlayBtn.addEventListener('click', () => {
  if (sequenceRunning) { stopSequence(); seqPlayBtn.textContent = 'Play sequence'; }
  else { seqPlayBtn.textContent = 'Pause sequence'; startSequence(); }
});
const seqReplayBtn = document.querySelector('#sequenceReplay');
if (seqReplayBtn) seqReplayBtn.addEventListener('click', () => { scrubSequence(0); if (seqPlayBtn) seqPlayBtn.textContent = 'Pause sequence'; startSequence(); });

function resize() {
  const w = host.clientWidth, h = host.clientHeight;
  camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h);
  labelRenderer.setSize(w, h);
}
window.addEventListener('resize', resize);
resize();
animateStage('overview');

autoTimer = null;
function tick() {
  requestAnimationFrame(tick);
  controls.update();
  ring.rotation.z += 0.015;
  reservoirMaterial.emissiveIntensity = 0.55 + Math.sin(performance.now() * 0.0021) * 0.18;
  directionArrow.position.z = 0.35 + Math.sin(performance.now() * 0.002) * 0.035;
  rimLight.position.x = 3 + Math.sin(performance.now() * 0.0007) * 1.2;
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}
tick();
