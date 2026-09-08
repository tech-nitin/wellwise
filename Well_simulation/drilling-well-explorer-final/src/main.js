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
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
scene.add(keyLight);
const rimLight = new THREE.PointLight(0x4ea7b7, 35, 38, 2);
rimLight.castShadow = true;
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

// Phase 6: engineered surface deck, shadow catchers and scale references.
const deckMat = new THREE.MeshStandardMaterial({ color: 0x152228, roughness: 0.92, metalness: 0.22 });
const deck = new THREE.Mesh(new THREE.BoxGeometry(11.5, 0.18, 7.8), deckMat);
deck.position.set(0, 2.78, 0);
deck.receiveShadow = true;
world.add(deck);
const deckEdge = new THREE.LineSegments(new THREE.EdgesGeometry(deck.geometry), new THREE.LineBasicMaterial({ color: 0x54717a, transparent: true, opacity: 0.25 }));
deckEdge.position.copy(deck.position);
world.add(deckEdge);

const servicePad = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.08, 2.1), new THREE.MeshStandardMaterial({ color: 0x23343a, roughness: 1 }));
servicePad.position.set(-3.1, 2.9, 0.5);
servicePad.receiveShadow = true;
world.add(servicePad);

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


// --- Phase 5 fidelity pass: detailed wellhead, casing shoes, BHA cutters, and formation stratal bands ---
const fidelityGroup = new THREE.Group();
world.add(fidelityGroup);

// Casing joints / couplings so the strings read as engineered pipe rather than a smooth tube.
const couplingMat = new THREE.MeshStandardMaterial({ color: 0x9eb2b7, metalness: 0.9, roughness: 0.26, transparent: true, opacity: 0.82 });
for (let ci = 0; ci < casingSpec.length; ci++) {
  const end = casingSpec[ci].end;
  const count = Math.max(3, Math.floor(18 * end));
  for (let j = 2; j < count; j += 3) {
    const t = (j / count) * end;
    const p = curve.getPointAt(Math.min(t, end - 0.01));
    const q = curve.getPointAt(Math.min(t + 0.012, 1));
    const c = new THREE.Mesh(new THREE.CylinderGeometry(casingSpec[ci].radius * 1.14, casingSpec[ci].radius * 1.14, 0.08, 16), couplingMat);
    c.position.copy(p);
    c.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), q.clone().sub(p).normalize());
    fidelityGroup.add(c);
  }
}

// Bottom-hole assembly detail: stabilizer blades + PDC-style cutter crown.
const bladeMat = new THREE.MeshStandardMaterial({ color: 0x47636b, metalness: 0.75, roughness: 0.32 });
for (const t of [0.84, 0.885, 0.925]) {
  const p = curve.getPointAt(t); const q = curve.getPointAt(Math.min(t + 0.02, 1));
  const axis = q.clone().sub(p).normalize();
  const station = new THREE.Group(); station.position.copy(p);
  station.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), axis);
  for (let k = 0; k < 4; k++) {
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.32, 0.16), bladeMat);
    blade.rotation.y = (Math.PI / 2) * k;
    blade.position.x = Math.cos((Math.PI / 2) * k) * 0.12;
    blade.position.z = Math.sin((Math.PI / 2) * k) * 0.12;
    station.add(blade);
  }
  fidelityGroup.add(station);
}
const bitDetail = new THREE.Group();
bitDetail.position.copy(bit.position);
bitDetail.quaternion.copy(bit.quaternion);
for (let k = 0; k < 10; k++) {
  const a = k / 10 * Math.PI * 2;
  const cutter = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), new THREE.MeshStandardMaterial({ color: 0xd4e2e5, metalness: 0.82, roughness: 0.18 }));
  cutter.position.set(Math.cos(a) * 0.18, -0.22, Math.sin(a) * 0.18);
  bitDetail.add(cutter);
}
fidelityGroup.add(bitDetail);

// Phase 6: PDC cutter/bit teeth and central nozzle detail.
const bitToothMat = new THREE.MeshStandardMaterial({ color: 0xe3ecee, metalness: 0.95, roughness: 0.16 });
for (let k = 0; k < 16; k++) {
  const a = k / 16 * Math.PI * 2;
  const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.14, 0.07), bitToothMat);
  tooth.position.set(Math.cos(a)*0.24, -0.24, Math.sin(a)*0.24);
  tooth.rotation.y = a;
  bitDetail.add(tooth);
}
const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.09, 0.2, 12), darkMat);
nozzle.position.y = -0.42;
bitDetail.add(nozzle);

// A translucent borehole annulus and completion shoe make the cutaway state more legible.
const annulus = new THREE.Mesh(
  new THREE.TubeGeometry(curve, 120, 0.115, 12, false),
  new THREE.MeshBasicMaterial({ color: 0x9bdde6, transparent: true, opacity: 0.06, side: THREE.DoubleSide, depthWrite: false })
);
fidelityGroup.add(annulus);
const shoeT = curve.getPointAt(0.64);
const shoeQ = curve.getPointAt(0.66);
const casingShoe = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.45, 16), new THREE.MeshStandardMaterial({ color: 0xb8c8cc, metalness: 0.8, roughness: 0.28, transparent: true, opacity: 0.75 }));
casingShoe.position.copy(shoeT);
casingShoe.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), shoeQ.clone().sub(shoeT).normalize());
fidelityGroup.add(casingShoe);

// Wavy formation bands visible on the cutaway face, matching the reference's stratified geology.
const stratalMat = new THREE.LineBasicMaterial({ color: 0xbdd3d4, transparent: true, opacity: 0.15 });
for (let li = 0; li < formations.length; li++) {
  for (let band = 0; band < 5; band++) {
    const pts = [];
    const baseY = formations[li].position.y - layerHeight * 0.34 + band * 0.15;
    for (let x = -3.65; x <= 3.65; x += 0.45) {
      const z = 2.23;
      const y = baseY + Math.sin(x * 2.1 + li * 0.7 + band) * 0.035;
      pts.push(new THREE.Vector3(x, y, z));
    }
    fidelityGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), stratalMat));
  }
}

// A target-zone halo gives the reservoir interval a restrained technical highlight.
const targetHalo = new THREE.Mesh(
  new THREE.BoxGeometry(layerWidth * 0.96, layerHeight * 0.92, layerDepth * 0.96),
  new THREE.MeshBasicMaterial({ color: 0x79d5df, wireframe: true, transparent: true, opacity: 0.12 })
);
targetHalo.position.copy(formations[4].position);
fidelityGroup.add(targetHalo);

// Dedicated inspection ring used by the close-up shots.
const inspectionRing = new THREE.Mesh(new THREE.RingGeometry(0.34, 0.39, 32), new THREE.MeshBasicMaterial({ color: 0xc5e9ee, transparent: true, opacity: 0.0, side: THREE.DoubleSide }));
inspectionRing.rotation.x = Math.PI / 2;
inspectionRing.position.copy(bit.position);
fidelityGroup.add(inspectionRing);

const pulseRing = new THREE.Mesh(new THREE.RingGeometry(0.44, 0.48, 36), new THREE.MeshBasicMaterial({ color: 0x67d1dd, transparent: true, opacity: 0.0, side: THREE.DoubleSide }));
pulseRing.rotation.x = Math.PI / 2;
pulseRing.position.copy(curve.getPointAt(0.93));
fidelityGroup.add(pulseRing);

const telemetryLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(-3.9, -5.35, 2.32), new THREE.Vector3(-2.0, -5.35, 2.32), new THREE.Vector3(-0.8, -4.1, 2.32)
]), new THREE.LineDashedMaterial({ color: 0x69c9d4, dashSize: 0.08, gapSize: 0.06, transparent: true, opacity: 0.55 }));
telemetryLine.computeLineDistances();
fidelityGroup.add(telemetryLine);

const grid = new THREE.GridHelper(24, 48, 0x3a5660, 0x1d3139);
grid.position.set(0, 2.9, 0); world.add(grid);

// Engineering depth ruler alongside the well path.
const rulerGroup = new THREE.Group();
const rulerMat = new THREE.LineBasicMaterial({ color: 0x6b858e, transparent: true, opacity: 0.34 });
const rulerX = -4.8;
const rulerYTop = 2.8;
const rulerYBot = -8.2;
rulerGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(rulerX, rulerYTop, 2.38), new THREE.Vector3(rulerX, rulerYBot, 2.38)
]), rulerMat));
for (let d = 0; d <= 10; d++) {
  const y = rulerYTop + (rulerYBot-rulerYTop)*(d/10);
  const pts = [new THREE.Vector3(rulerX, y, 2.38), new THREE.Vector3(rulerX+0.14, y, 2.38)];
  rulerGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), rulerMat));
}
detailGroup.add(rulerGroup);

world.traverse(obj => {
  if (obj.isMesh) {
    obj.castShadow = obj.castShadow ?? true;
    obj.receiveShadow = obj.receiveShadow ?? true;
  }
});

const shotMarker = document.createElement('div');
shotMarker.className = 'shot-marker';
shotMarker.textContent = 'SHOT 01 / 09';
viewport.appendChild(shotMarker);
const referenceNote = document.createElement('div');
referenceNote.className = 'reference-note';
referenceNote.textContent = 'REFERENCE-MATCHED ENGINEERING VISUAL / NOT TO SCALE';
viewport.appendChild(referenceNote);

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
addLabel('12 1/4" hole section', 'label-amber', new THREE.Vector3(-3.05, 0.35, 0.8));
addLabel('9 5/8" casing shoe', 'label-sand', new THREE.Vector3(-2.9, -3.1, 0.8));
addLabel('Reservoir window', 'label-blue', new THREE.Vector3(-2.9, -5.6, 0.78));

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
  { key: 'overview', label: '01  Surface / wellhead setup', duration: 2800, camera: [15.2, 8.4, 16.2], target: [0, -1.0, 0], drill: 0.04, casing: 0.72, reservoir: 0.05, formation: 0.36, ring: 0.0 },
  { key: 'overview', label: '02  Wellhead + conductor inspection', duration: 2500, camera: [8.4, 5.1, 9.2], target: [0, 3.35, 0], drill: 0.08, casing: 0.82, reservoir: 0.06, formation: 0.40, ring: 0.0 },
  { key: 'well', label: '03  MD/TVD well-section review', duration: 3200, camera: [12.8, 4.0, 14.0], target: [0, -1.8, 0], drill: 0.22, casing: 0.84, reservoir: 0.08, formation: 0.43, ring: 0.0 },
  { key: 'lithology', label: '04  Lithology + reservoir review', duration: 3400, camera: [13.6, 1.3, 9.3], target: [0.0, -3.8, 0], drill: 0.45, casing: 0.42, reservoir: 0.26, formation: 0.62, ring: 0.0 },
  { key: 'bha', label: '05  Directional BHA run-in', duration: 3300, camera: [7.4, -0.6, 9.0], target: [2.1, -6.7, 0.18], drill: 0.88, casing: 0.28, reservoir: 0.24, formation: 0.27, ring: 0.0 },
  { key: 'bha', label: '06  PDC bit / BHA inspection', duration: 2500, camera: [4.6, -4.6, 4.8], target: [2.8, -7.6, 0.35], drill: 1.0, casing: 0.24, reservoir: 0.18, formation: 0.22, ring: 1.0 },
  { key: 'casing', label: '07  Production casing run', duration: 3200, camera: [10.8, 6.1, 14.8], target: [0, -2.5, 0], drill: 0.34, casing: 1.0, reservoir: 0.14, formation: 0.34, ring: 0.0 },
  { key: 'casing', label: '08  Casing shoe / annulus check', duration: 2800, camera: [9.0, 0.7, 8.4], target: [0.2, -4.0, 0], drill: 0.22, casing: 1.0, reservoir: 0.17, formation: 0.38, ring: 0.0 },
  { key: 'evaluation', label: '09  Final evaluation / evidence review', duration: 3600, camera: [14.0, 6.2, 16.0], target: [0.3, -3.3, 0], drill: 0.72, casing: 0.80, reservoir: 0.34, formation: 0.48, ring: 0.0 },
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
    ring: (item.ring ?? 0) + (((next?.ring ?? item.ring ?? 0) - (item.ring ?? 0)) * smooth),
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
  inspectionRing.material.opacity = 0.08 + current.ring * 0.82;
  inspectionRing.scale.setScalar(1 + current.ring * 0.28);
  const stageKey = item.key;
  const stageIdx = Math.max(0, stageOrder.indexOf(stageKey));
  const data = stageData[stageKey];
  setMetrics(data);
  setMilestones(stageIdx);
  document.querySelectorAll('#stageNav > button').forEach(b => b.classList.toggle('active', b.dataset.stage === stageKey));
  const overall = (index + localProgress) / (sequence.length - 1);
  document.querySelector('#timeline').value = String(Math.round(overall * 100));
  document.querySelector('#stageIndex').textContent = `${String(stageIdx + 1).padStart(2, '0')} / 06`;
  const phaseLabel = document.querySelector('#sequenceLabel');
  if (phaseLabel) phaseLabel.textContent = item.label;
  shotMarker.textContent = `SHOT ${String(index + 1).padStart(2, '0')} / 09`;
  const shotValue = document.querySelector('#shotValue');
  if (shotValue) shotValue.textContent = `${String(index + 1).padStart(2, '0')} / 09`;
  viewport.classList.add('flash-shot');
  window.setTimeout(() => viewport.classList.remove('flash-shot'), 460);
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


const shotModeBtn = document.createElement('button');
shotModeBtn.id = 'shotModeBtn';
shotModeBtn.textContent = 'Cinematic';
shotModeBtn.className = 'secondary';
const seqActions = document.querySelector('.sequence-actions');
if (seqActions) seqActions.appendChild(shotModeBtn);
let cinematicMode = true;
shotModeBtn.addEventListener('click', () => {
  cinematicMode = !cinematicMode;
  shotModeBtn.textContent = cinematicMode ? 'Cinematic' : 'Manual';
});

const qualityBtn = document.createElement('button');
qualityBtn.id = 'qualityBtn';
qualityBtn.textContent = 'High detail';
qualityBtn.className = 'secondary';
if (seqActions) seqActions.appendChild(qualityBtn);
let highDetail = true;
qualityBtn.addEventListener('click', () => {
  highDetail = !highDetail;
  qualityBtn.textContent = highDetail ? 'High detail' : 'Performance';
  const renderValue = document.querySelector('#renderValue');
  if (renderValue) renderValue.textContent = highDetail ? 'High' : 'Performance';
  renderer.setPixelRatio(highDetail ? Math.min(window.devicePixelRatio, 2) : 1);
});

const captureBtn = document.createElement('button');
captureBtn.id = 'captureBtn';
captureBtn.textContent = 'Capture';
captureBtn.className = 'secondary';
if (seqActions) seqActions.appendChild(captureBtn);
captureBtn.addEventListener('click', () => {
  renderer.render(scene, camera);
  renderer.domElement.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `drilling-well-${currentStage}-${Date.now()}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
});

const seqPlayBtn = document.querySelector('#sequencePlay');
if (seqPlayBtn) seqPlayBtn.addEventListener('click', () => {
  if (sequenceRunning) { stopSequence(); seqPlayBtn.textContent = 'Play sequence'; }
  else { seqPlayBtn.textContent = 'Pause sequence'; startSequence(); }
});
const seqReplayBtn = document.querySelector('#sequenceReplay');
if (seqReplayBtn) seqReplayBtn.addEventListener('click', () => { scrubSequence(0); if (seqPlayBtn) seqPlayBtn.textContent = 'Pause sequence'; startSequence(); });

const theaterBtn = document.querySelector('#theaterBtn');
if (theaterBtn) theaterBtn.addEventListener('click', () => {
  document.body.classList.toggle('theater-mode');
  theaterBtn.textContent = document.body.classList.contains('theater-mode') ? 'Exit theater' : 'Theater';
  window.setTimeout(resize, 40);
});

document.addEventListener('keydown', (e) => {
  if (e.target && ['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;
  if (e.code === 'Space') { e.preventDefault(); if (sequenceRunning) stopSequence(); else startSequence(); }
  if (e.key === 'ArrowRight') { const i = Math.min(stageOrder.length - 1, stageOrder.indexOf(currentStage) + 1); animateStage(stageOrder[i]); }
  if (e.key === 'ArrowLeft') { const i = Math.max(0, stageOrder.indexOf(currentStage) - 1); animateStage(stageOrder[i]); }
  if (e.key.toLowerCase() === 'r') scrubSequence(0);
});

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
  if (sequenceRunning && cinematicMode) {
    const t = performance.now() * 0.00022;
    camera.position.x += Math.sin(t) * 0.0025;
    camera.position.z += Math.cos(t * 0.9) * 0.0020;
  }
  controls.update();
  ring.rotation.z += 0.015;
  // Slow mechanical rotation and hydraulic pulse add life without turning the scene into a game.
  const drillProgress = drillGroup.userData.progress ?? 0;
  drillGroup.rotation.y += 0.006 + drillProgress * 0.012;
  pulseRing.material.opacity = Math.max(0, 0.06 + Math.sin(performance.now() * 0.004) * 0.05) * drillProgress;
  pulseRing.scale.setScalar(1 + (Math.sin(performance.now() * 0.003) * 0.06 + 0.08) * drillProgress);
  telemetryLine.material.opacity = 0.32 + drillProgress * 0.22;
  reservoirMaterial.emissiveIntensity = 0.55 + Math.sin(performance.now() * 0.0021) * 0.18;
  directionArrow.position.z = 0.35 + Math.sin(performance.now() * 0.002) * 0.035;
  rimLight.position.x = 3 + Math.sin(performance.now() * 0.0007) * 1.2;
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}
tick();
