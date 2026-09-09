"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Gauge,
  Disc,
  Droplets,
  AlertTriangle,
  Radio,
  Layers,
  Sparkles,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EventMarker {
  id: string;
  name: string;
  depth: string;
  depthM: number;
  severity: "high" | "warning";
  type: string;
  description: string;
  precedent: string;
  topPct: number;
  leftPct: number;
}

const HISTORICAL_EVENTS: EventMarker[] = [
  {
    id: "event-torque",
    name: "TORQUE SPIKE",
    depth: "3,180 m",
    depthM: 3180,
    severity: "warning",
    type: "Precursor Anomaly",
    description: "Torque drag +34% above local baseline across permeable sandstone contact.",
    precedent: "Historical offset match (NHK-119)",
    topPct: 68,
    leftPct: 52,
  },
  {
    id: "event-mudloss",
    name: "MUD LOSS",
    depth: "3,120 m",
    depthM: 3120,
    severity: "high",
    type: "Lost Circulation",
    description: "Partial seepage of 14 bbl/hr recorded during initial Barail formation entry.",
    precedent: "Precedent record in 3 offset wells",
    topPct: 58,
    leftPct: 44,
  },
];

export function DrillingVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredEvent, setHoveredEvent] = useState<EventMarker | null>(null);
  const [activeFormation, setActiveFormation] = useState<string>("Jurassic T13");
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    let width = container.clientWidth || 560;
    let height = container.clientHeight || 580;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = null;

    // 2. Camera: Elevated 3/4 engineering digital twin angle
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 1000);
    camera.position.set(15, 9, 21);
    camera.lookAt(0.5, -3.2, 0);

    // 3. Renderer with antialiasing and alpha
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    container.appendChild(renderer.domElement);

    // 4. Lighting: Warm editorial earth + deep petroleum fill
    const ambientLight = new THREE.AmbientLight(0xfdfbf7, 1.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff8ee, 2.4);
    sunLight.position.set(20, 28, 16);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const petroleumFill = new THREE.DirectionalLight(0x245463, 1.1);
    petroleumFill.position.set(-16, -10, -14);
    scene.add(petroleumFill);

    const copperRimLight = new THREE.PointLight(0xd96b3b, 1.4, 25);
    copperRimLight.position.set(2, -10, 3);
    scene.add(copperRimLight);

    // Master Group
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // ==========================================
    // 5. SURFACE TERRAIN & WELLHEAD PAD (Y = 0)
    // ==========================================
    const surfaceGroup = new THREE.Group();
    masterGroup.add(surfaceGroup);

    // Surface Pad Base (Warm Sand / Ivory Field)
    const padGeo = new THREE.BoxGeometry(9.4, 0.35, 7.8);
    const padMat = new THREE.MeshStandardMaterial({
      color: 0xf5f0e6,
      roughness: 0.88,
      metalness: 0.05,
    });
    const surfacePad = new THREE.Mesh(padGeo, padMat);
    surfacePad.position.set(0, 0, 0);
    surfacePad.receiveShadow = true;
    surfaceGroup.add(surfacePad);

    // Ground Grid Wireframe Overlay (Technical Coordinates)
    const gridHelper = new THREE.GridHelper(9.2, 12, 0xddd2c0, 0xe9e4da);
    gridHelper.position.set(0, 0.18, 0);
    surfaceGroup.add(gridHelper);

    // Cellar Pit Cutout around Wellhead
    const cellarGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.4, 24);
    const cellarMat = new THREE.MeshStandardMaterial({
      color: 0x142b3a,
      roughness: 0.5,
      metalness: 0.4,
    });
    const cellar = new THREE.Mesh(cellarGeo, cellarMat);
    cellar.position.set(0, 0.05, 0);
    surfaceGroup.add(cellar);

    // Blowout Preventer (BOP) / Wellhead Stack (Deep Petroleum & Copper)
    const wellheadGroup = new THREE.Group();
    surfaceGroup.add(wellheadGroup);

    const bopMat = new THREE.MeshStandardMaterial({
      color: 0x142b3a,
      metalness: 0.7,
      roughness: 0.3,
    });
    const copperAccentMat = new THREE.MeshStandardMaterial({
      color: 0xd96b3b,
      metalness: 0.8,
      roughness: 0.25,
    });

    const bopBodyGeo = new THREE.CylinderGeometry(0.32, 0.38, 0.75, 16);
    const bopBody = new THREE.Mesh(bopBodyGeo, bopMat);
    bopBody.position.set(0, 0.55, 0);
    wellheadGroup.add(bopBody);

    const bopRingGeo = new THREE.TorusGeometry(0.38, 0.07, 8, 20);
    const bopRing = new THREE.Mesh(bopRingGeo, copperAccentMat);
    bopRing.rotation.x = Math.PI / 2;
    bopRing.position.set(0, 0.65, 0);
    wellheadGroup.add(bopRing);

    // ==========================================
    // 6. STYLIZED 3D DRILLING RIG / DERRICK
    // ==========================================
    const rigGroup = new THREE.Group();
    masterGroup.add(rigGroup);

    const derrickSteelMat = new THREE.MeshStandardMaterial({
      color: 0x142b3a,
      roughness: 0.32,
      metalness: 0.75,
    });

    // Substructure Platform
    const subGeo = new THREE.BoxGeometry(2.4, 0.55, 2.4);
    const subMesh = new THREE.Mesh(subGeo, derrickSteelMat);
    subMesh.position.set(0, 0.85, 0);
    subMesh.castShadow = true;
    rigGroup.add(subMesh);

    // Drill Floor Rotary Table
    const rotaryGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.12, 16);
    const rotaryMesh = new THREE.Mesh(rotaryGeo, copperAccentMat);
    rotaryMesh.position.set(0, 1.18, 0);
    rigGroup.add(rotaryMesh);

    // Derrick Mast - 4 Tapered Lattice Columns (Height ~5.8m)
    const mastHeight = 5.6;
    const mastBaseW = 1.0;
    const mastTopW = 0.42;

    const columnGeo = new THREE.CylinderGeometry(0.045, 0.065, mastHeight, 8);
    const corners = [
      { bx: mastBaseW, bz: mastBaseW, tx: mastTopW, tz: mastTopW },
      { bx: -mastBaseW, bz: mastBaseW, tx: -mastTopW, tz: mastTopW },
      { bx: mastBaseW, bz: -mastBaseW, tx: mastTopW, tz: -mastTopW },
      { bx: -mastBaseW, bz: -mastBaseW, tx: -mastTopW, tz: -mastTopW },
    ];

    corners.forEach((c) => {
      const col = new THREE.Mesh(columnGeo, derrickSteelMat);
      col.position.set(
        (c.bx + c.tx) / 2,
        1.15 + mastHeight / 2,
        (c.bz + c.tz) / 2
      );
      // Slight inward taper tilt
      col.rotation.z = (c.bx - c.tx) / mastHeight;
      col.rotation.x = -(c.bz - c.tz) / mastHeight;
      col.castShadow = true;
      rigGroup.add(col);
    });

    // Cross Braces & Horizontal Girts in Copper Flame / Deep Steel
    const levels = [2.2, 3.4, 4.6, 5.8];
    levels.forEach((lvlY) => {
      const prog = (lvlY - 1.15) / mastHeight;
      const w = mastBaseW * (1 - prog) + mastTopW * prog;
      const girtGeo = new THREE.BoxGeometry(w * 2, 0.06, w * 2);
      const girt = new THREE.Mesh(girtGeo, copperAccentMat);
      girt.position.set(0, lvlY, 0);
      rigGroup.add(girt);
    });

    // Crown Block (Top Machinery)
    const crownGeo = new THREE.BoxGeometry(0.85, 0.35, 0.85);
    const crown = new THREE.Mesh(crownGeo, derrickSteelMat);
    crown.position.set(0, 1.15 + mastHeight + 0.18, 0);
    rigGroup.add(crown);

    // Crown Warning Beacon Light
    const beaconGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xd96b3b });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.set(0, 1.15 + mastHeight + 0.42, 0);
    rigGroup.add(beacon);

    // Traveling Block & Top Drive
    const topDriveGeo = new THREE.BoxGeometry(0.35, 0.65, 0.35);
    const topDrive = new THREE.Mesh(topDriveGeo, copperAccentMat);
    topDrive.position.set(0, 4.2, 0);
    rigGroup.add(topDrive);

    // Kelly / Surface Drillstring Rod
    const kellyGeo = new THREE.CylinderGeometry(0.04, 0.04, 3.2, 8);
    const kelly = new THREE.Mesh(kellyGeo, copperAccentMat);
    kelly.position.set(0, 2.7, 0);
    rigGroup.add(kelly);

    // ====================================================
    // 7. SUBSURFACE GEOLOGICAL FORMATIONS (LAYERED STRATA)
    // ====================================================
    const strataGroup = new THREE.Group();
    masterGroup.add(strataGroup);

    // 5 Stratigraphic Layers with distinct engineering colors & depths
    const formations = [
      {
        name: "Alluvium",
        topM: 0,
        botM: 1200,
        thickness: 2.3,
        color: 0xe9e4da, // Mist / Sand
        roughness: 0.9,
      },
      {
        name: "Tipam Sandstone",
        topM: 1200,
        botM: 2650,
        thickness: 2.8,
        color: 0xc47a53, // Burnt Earth / Sandstone
        roughness: 0.82,
      },
      {
        name: "Barail Shale",
        topM: 2650,
        botM: 3120,
        thickness: 2.7,
        color: 0x245463, // Petrol Blue / Shale
        roughness: 0.7,
      },
      {
        name: "Jurassic T13 (Pay Zone)",
        topM: 3120,
        botM: 3280,
        thickness: 2.6,
        color: 0x142b3a, // Deep Petroleum / Target Zone
        roughness: 0.55,
        isTarget: true,
      },
      {
        name: "Basement Bedrock",
        topM: 3280,
        botM: 3500,
        thickness: 1.2,
        color: 0x0d1b24, // Ink Bedrock
        roughness: 0.95,
      },
    ];

    let currentDepthY = -0.2;
    const blockWidth = 9.2;
    const blockDepth = 7.4;

    formations.forEach((form, idx) => {
      const layerGeo = new THREE.BoxGeometry(blockWidth, form.thickness, blockDepth);
      const layerMat = new THREE.MeshStandardMaterial({
        color: form.color,
        roughness: form.roughness,
        metalness: form.isTarget ? 0.25 : 0.08,
      });

      const layerMesh = new THREE.Mesh(layerGeo, layerMat);
      layerMesh.position.set(0, currentDepthY - form.thickness / 2, 0);
      layerMesh.receiveShadow = true;
      strataGroup.add(layerMesh);

      // Strata Horizon Separator Line (Copper / Warm Sand)
      const borderGeo = new THREE.BoxGeometry(blockWidth + 0.02, 0.035, blockDepth + 0.02);
      const borderMat = new THREE.MeshBasicMaterial({
        color: form.isTarget ? 0xd96b3b : 0xddd2c0,
        transparent: true,
        opacity: form.isTarget ? 0.9 : 0.45,
      });
      const borderMesh = new THREE.Mesh(borderGeo, borderMat);
      borderMesh.position.set(0, currentDepthY, 0);
      strataGroup.add(borderMesh);

      currentDepthY -= form.thickness;
    });

    // ====================================================
    // 8. WELLBORE TRAJECTORY (DESCENDING INTO JURASSIC T13)
    // ====================================================
    const wellboreGroup = new THREE.Group();
    masterGroup.add(wellboreGroup);

    // 3D Spline Curve through formations
    const trajectoryPoints = [
      new THREE.Vector3(0, 0.1, 0), // Wellhead
      new THREE.Vector3(0, -2.5, 0), // Through Alluvium
      new THREE.Vector3(0.2, -5.2, 0.15), // Through Tipam
      new THREE.Vector3(0.7, -7.8, 0.35), // Through Barail
      new THREE.Vector3(1.4, -9.6, 0.65), // Approaching Jurassic T13
      new THREE.Vector3(2.1, -10.5, 0.95), // Current Bit (3,240 m)
    ];

    const wellCurve = new THREE.CatmullRomCurve3(trajectoryPoints);

    // Outer Casing Guide Sleeve (Transparent Technical Mesh)
    const casingGeo = new THREE.TubeGeometry(wellCurve, 64, 0.24, 12, false);
    const casingMat = new THREE.MeshBasicMaterial({
      color: 0xf5f0e6,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const casingMesh = new THREE.Mesh(casingGeo, casingMat);
    wellboreGroup.add(casingMesh);

    // Inner Glowing Wellbore Core (Copper Flame #D96B3B)
    const coreGeo = new THREE.TubeGeometry(wellCurve, 64, 0.13, 12, false);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xd96b3b,
      emissive: 0xa9533d,
      emissiveIntensity: 0.85,
      roughness: 0.25,
      metalness: 0.7,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    wellboreGroup.add(coreMesh);

    // Active Drill Bit at 3,240 m (PDC / Cone Geometry)
    const bitPoint = wellCurve.getPoint(1);
    const bitGroup = new THREE.Group();
    bitGroup.position.copy(bitPoint);
    wellboreGroup.add(bitGroup);

    const bitGeo = new THREE.ConeGeometry(0.3, 0.65, 12);
    const bitMat = new THREE.MeshStandardMaterial({
      color: 0xd96b3b,
      metalness: 0.9,
      roughness: 0.15,
      emissive: 0xa9533d,
      emissiveIntensity: 0.9,
    });
    const bitMesh = new THREE.Mesh(bitGeo, bitMat);
    bitMesh.rotation.x = Math.PI * 0.78;
    bitMesh.rotation.z = -Math.PI * 0.25;
    bitGroup.add(bitMesh);

    // Pulsing Depth Concentric Beacon Rings
    const ringGeo = new THREE.RingGeometry(0.38, 0.52, 28);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xd96b3b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const depthRing = new THREE.Mesh(ringGeo, ringMat);
    depthRing.rotation.x = Math.PI / 2;
    bitGroup.add(depthRing);

    // ====================================================
    // 9. 3D HISTORICAL EVENT MARKER PINS ON WELLBORE
    // ====================================================
    const eventGroup = new THREE.Group();
    masterGroup.add(eventGroup);

    // Event 1: Mud Loss at 3,120m (t ~ 0.78)
    const mudLossPt = wellCurve.getPoint(0.76);
    const pinGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const pinMatRed = new THREE.MeshStandardMaterial({
      color: 0x843d35,
      emissive: 0x843d35,
      emissiveIntensity: 0.6,
      roughness: 0.2,
    });
    const mudLossPin = new THREE.Mesh(pinGeo, pinMatRed);
    mudLossPin.position.copy(mudLossPt);
    eventGroup.add(mudLossPin);

    // Event 2: Torque Spike at 3,180m (t ~ 0.88)
    const torquePt = wellCurve.getPoint(0.88);
    const pinMatAmber = new THREE.MeshStandardMaterial({
      color: 0xd96b3b,
      emissive: 0xa9533d,
      emissiveIntensity: 0.8,
      roughness: 0.2,
    });
    const torquePin = new THREE.Mesh(pinGeo, pinMatAmber);
    torquePin.position.copy(torquePt);
    eventGroup.add(torquePin);

    // ====================================================
    // 10. MWD TELEMETRY PARTICLES TRAVELING DOWN DRILLSTRING
    // ====================================================
    const particleCount = 24;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleProgress = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particleProgress[i] = i / particleCount;
      const pt = wellCurve.getPoint(particleProgress[i]);
      particlePositions[i * 3] = pt.x;
      particlePositions[i * 3 + 1] = pt.y;
      particlePositions[i * 3 + 2] = pt.z;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xd96b3b,
      size: 0.24,
      transparent: true,
      opacity: 0.95,
    });
    const telemetryParticles = new THREE.Points(particleGeo, particleMat);
    wellboreGroup.add(telemetryParticles);

    // ====================================================
    // 11. CONTINUOUS RAF LOOP & GENTLE MOUSE PARALLAX
    // ====================================================
    let animationId: number;
    const startTime = performance.now();
    let mouseX = 0;
    let mouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / width - 0.5;
      const y = (e.clientY - rect.top) / height - 0.5;
      mouseX = x * 0.22;
      mouseY = y * 0.16;
      setIsInteracting(true);
    };

    const handleMouseLeave = () => {
      mouseX = 0;
      mouseY = 0;
      setIsInteracting(false);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) * 0.001;

      // Subtle engineering parallax (gentle tilt, NO aggressive rotation)
      targetRotY = Math.sin(elapsed * 0.15) * 0.05 + mouseX;
      targetRotX = Math.cos(elapsed * 0.12) * 0.025 + mouseY;

      masterGroup.rotation.y += (targetRotY - masterGroup.rotation.y) * 0.05;
      masterGroup.rotation.x += (targetRotX - masterGroup.rotation.x) * 0.05;

      // Pulse depth beacon ring
      const scale = 1 + Math.sin(elapsed * 2.6) * 0.12;
      depthRing.scale.set(scale, scale, scale);

      // Rotate drill bit
      bitMesh.rotation.y += 0.07;

      // Beacon blink on crown
      beaconMat.color.setHex(Math.sin(elapsed * 4) > 0 ? 0xd96b3b : 0x843d35);

      // Event pins pulse
      const pinScale = 1 + Math.sin(elapsed * 3.2) * 0.14;
      mudLossPin.scale.set(pinScale, pinScale, pinScale);
      torquePin.scale.set(pinScale, pinScale, pinScale);

      // Travel telemetry particles down the drillstring
      const posAttr = particleGeo.getAttribute("position") as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        particleProgress[i] += 0.0032;
        if (particleProgress[i] > 1) particleProgress[i] = 0;
        const pt = wellCurve.getPoint(particleProgress[i]);
        posAttr.setXYZ(i, pt.x, pt.y, pt.z);
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 560;
      height = container.clientHeight || 580;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[540px] sm:h-[600px] lg:h-[640px] flex items-center justify-center select-none overflow-hidden">
      {/* 1. Three.js Canvas Container */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
        title="Interactive Subsurface Well Intelligence Model (Hover to inspect depth, formations, and historical events)"
      />

      {/* 2. Top-Right Callout: Bit Depth & Target TD */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: [0, -4, 0] }}
        transition={{
          opacity: { duration: 0.5, delay: 0.2 },
          y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute top-6 right-2 sm:right-6 bg-[#FAF8F5]/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-[#DDD2C0] shadow-sm flex items-center gap-3 z-10 text-left hover:border-[#142B3A]/40 transition-all pointer-events-auto"
      >
        <div className="h-8 w-8 rounded-xl bg-[#142B3A] flex items-center justify-center text-[#D96B3B] shrink-0">
          <Activity className="h-4 w-4" />
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#142B3A]/70 block font-bold">
            BIT DEPTH (MD)
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-extrabold font-mono text-[#0D1B24]">
              3,240.0 m
            </span>
            <span className="text-[10px] font-mono text-[#2F8068] font-bold">
              &bull; TD 3,850 m
            </span>
          </div>
        </div>
      </motion.div>

      {/* 3. Top-Left Callout: ROP Live & Active Status */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: [0, 4, 0] }}
        transition={{
          opacity: { duration: 0.5, delay: 0.35 },
          x: { duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 },
        }}
        className="absolute top-16 left-2 sm:left-4 bg-[#FAF8F5]/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-[#DDD2C0] shadow-sm flex items-center gap-3 z-10 text-left hover:border-[#142B3A]/40 transition-all pointer-events-auto"
      >
        <div className="h-8 w-8 rounded-xl bg-[#D96B3B]/15 flex items-center justify-center text-[#A9533D] shrink-0">
          <Gauge className="h-4 w-4" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#142B3A]/70 font-bold">
              ROP LIVE
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#2F8068] animate-pulse" />
          </div>
          <span className="text-sm font-extrabold font-mono text-[#0D1B24]">
            18.5 m/h
          </span>
        </div>
      </motion.div>

      {/* 4. Bottom-Left Callout: Weight on Bit (WOB) */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: [0, 4, 0] }}
        transition={{
          opacity: { duration: 0.5, delay: 0.5 },
          y: { duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
        }}
        className="absolute bottom-24 left-2 sm:left-4 bg-[#FAF8F5]/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-[#DDD2C0] shadow-sm flex items-center gap-3 z-10 text-left hover:border-[#142B3A]/40 transition-all pointer-events-auto"
      >
        <div className="h-8 w-8 rounded-xl bg-[#DDD2C0]/50 flex items-center justify-center text-[#142B3A] shrink-0">
          <Disc className="h-4 w-4" />
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#142B3A]/70 font-bold block">
            WEIGHT ON BIT
          </span>
          <span className="text-sm font-extrabold font-mono text-[#0D1B24]">
            85 kN <span className="text-[10px] text-[#142B3A]/60 font-semibold">(22 klbf)</span>
          </span>
        </div>
      </motion.div>

      {/* 5. Bottom-Right Callout: Mud Circulation Flow */}
      <motion.div
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: [0, -4, 0] }}
        transition={{
          opacity: { duration: 0.5, delay: 0.65 },
          x: { duration: 5.6, repeat: Infinity, ease: "easeInOut", delay: 1.2 },
        }}
        className="absolute bottom-16 right-2 sm:right-6 bg-[#FAF8F5]/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-[#DDD2C0] shadow-sm flex items-center gap-3 z-10 text-left hover:border-[#142B3A]/40 transition-all pointer-events-auto"
      >
        <div className="h-8 w-8 rounded-xl bg-[#D96B3B]/15 flex items-center justify-center text-[#A9533D] shrink-0">
          <Droplets className="h-4 w-4" />
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#142B3A]/70 font-bold block">
            MUD CIRCULATION
          </span>
          <span className="text-sm font-extrabold font-mono text-[#0D1B24]">
            820 L/min <span className="text-[10px] text-[#2F8068] font-bold">&bull; 18.5 MPa</span>
          </span>
        </div>
      </motion.div>

      {/* 6. Vertical Formation Depth Correlation Rail (Left Side of Visual) */}
      <div className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-5 hidden md:flex flex-col gap-1.5 z-10 pointer-events-auto text-left font-mono text-[10px]">
        <div className="p-2.5 rounded-2xl bg-[#FAF8F5]/90 backdrop-blur-md border border-[#DDD2C0] shadow-xs space-y-1.5 max-w-[145px]">
          <div className="flex items-center gap-1.5 text-[#A9533D] font-extrabold pb-1 border-b border-[#DDD2C0]">
            <Layers className="h-3 w-3" />
            <span>DEPTH STRATA</span>
          </div>

          <div className="space-y-1 text-[9px]">
            <div className="flex items-center justify-between text-[#142B3A]/70">
              <span>0 m</span>
              <span className="font-semibold text-[#0D1B24]">Surface</span>
            </div>
            <div className="flex items-center justify-between text-[#142B3A]/70">
              <span>1,200 m</span>
              <span className="font-semibold text-[#0D1B24]">Alluvium</span>
            </div>
            <div className="flex items-center justify-between text-[#142B3A]/70">
              <span>2,650 m</span>
              <span className="font-semibold text-[#0D1B24]">Barail Shale</span>
            </div>
            <div className="flex items-center justify-between text-[#D96B3B] font-bold bg-[#D96B3B]/10 px-1.5 py-0.5 rounded border border-[#D96B3B]/30">
              <span>3,120 m</span>
              <span>Jurassic T13</span>
            </div>
            <div className="flex items-center justify-between text-[#2F8068] font-bold pt-0.5">
              <span>3,240 m</span>
              <span>● BIT DEPTH</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Interactive Historical Event Trigger Chips (Overlay on 3D coordinates) */}
      {HISTORICAL_EVENTS.map((event) => (
        <div
          key={event.id}
          className="absolute z-20 transition-transform"
          style={{ top: `${event.topPct}%`, left: `${event.leftPct}%` }}
        >
          <div className="relative group">
            {/* Pulsing Pin Marker */}
            <button
              onMouseEnter={() => setHoveredEvent(event)}
              onMouseLeave={() => setHoveredEvent(null)}
              onClick={() => setHoveredEvent((prev) => (prev?.id === event.id ? null : event))}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold shadow-md transition-all cursor-pointer border",
                event.severity === "high"
                  ? "bg-[#843D35] text-white border-[#843D35] hover:bg-[#6e3029]"
                  : "bg-[#D96B3B] text-white border-[#D96B3B] hover:bg-[#c45a2c]"
              )}
              aria-label={`Historical event: ${event.name} at ${event.depth}`}
            >
              <AlertTriangle className="h-3 w-3 animate-pulse" />
              <span>{event.name}</span>
              <span className="opacity-90">{event.depth}</span>
            </button>

            {/* Event Tooltip on Hover */}
            <AnimatePresence>
              {hoveredEvent?.id === event.id && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 rounded-xl bg-[#F5F0E6] border border-[#DDD2C0] shadow-lg text-left z-30 font-mono text-xs pointer-events-none"
                >
                  <div className="flex items-center justify-between text-[10px] pb-1 border-b border-[#DDD2C0]">
                    <span className="font-extrabold text-[#843D35]">{event.type}</span>
                    <span className="text-[#142B3A]/70">{event.depth}</span>
                  </div>
                  <p className="text-[11px] text-[#0D1B24] font-medium leading-tight mt-1.5">
                    {event.description}
                  </p>
                  <div className="mt-2 pt-1 border-t border-[#DDD2C0]/70 text-[9px] text-[#245463] font-bold">
                    &bull; {event.precedent}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ))}

      {/* 8. Bottom Grounding Status Strip */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[#FAF8F5]/95 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#DDD2C0] text-[10px] font-mono text-[#0D1B24] flex items-center gap-2.5 pointer-events-none shadow-xs">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#D96B3B] animate-pulse" />
          <span className="font-bold">CURRENT FORMATION:</span>
          <span className="text-[#D96B3B] font-extrabold">JURASSIC T13</span>
        </span>
        <span className="text-[#DDD2C0]">&bull;</span>
        <span className="text-[#142B3A]/70 hidden sm:inline">
          Bit: 3,240 m (Pay Zone Interval)
        </span>
      </div>
    </div>
  );
}
