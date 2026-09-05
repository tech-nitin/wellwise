"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";
import { Activity, Gauge, Disc, Droplets, Radio } from "lucide-react";

export function DrillingVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = null; // transparent background

    // 2. Camera: Isometric high-angle perspective
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(16, 15, 22);
    camera.lookAt(0, -3.5, 0);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 4. Lighting: Warm ambient + crisp key directional light
    const ambientLight = new THREE.AmbientLight(0xfff8ee, 1.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    dirLight.position.set(22, 32, 18);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const petroleumFill = new THREE.DirectionalLight(0x0b6b4f, 0.9);
    petroleumFill.position.set(-18, -12, -12);
    scene.add(petroleumFill);

    // Master Group for Model
    const rigGroup = new THREE.Group();
    scene.add(rigGroup);

    // 5. Surface Ground Plane (Ivory Field #F5F0E6 / Warm Sand #DDD2C0)
    const groundGeo = new THREE.CylinderGeometry(8.5, 8.5, 0.4, 48);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xf5f0e6,
      roughness: 0.85,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = 0;
    ground.receiveShadow = true;
    rigGroup.add(ground);

    // Surface Technical Concentric Grid Lines (Warm Sand / Ivory Field)
    const gridHelper = new THREE.PolarGridHelper(8.2, 8, 4, 32, 0xddd2c0, 0xf5f0e6);
    gridHelper.position.y = 0.22;
    rigGroup.add(gridHelper);

    // 6. Subsurface Geological Layers (270° Cutaway Cake Slice)
    const layerColors = [
      0xe9e4da, // 1. Mist / Upper Alluvial Sand (0 to -2.2)
      0xddd2c0, // 2. Warm Sand / Girujan Claystone (-2.2 to -5.0)
      0xa9533d, // 3. Burnt Earth / Tipam Sandstone (-5.0 to -8.2)
      0x245463, // 4. Petrol Blue / Barail Shale (-8.2 to -11.5)
      0x142b3a, // 5. Deep Petroleum / Jurassic Pay Zone (-11.5 to -14.2)
    ];

    const layerThicknesses = [2.2, 2.8, 3.2, 3.3, 2.7];
    let currentY = -0.2;

    layerThicknesses.forEach((thickness, i) => {
      const layerGeo = new THREE.CylinderGeometry(
        8.4 - i * 0.1,
        8.3 - i * 0.1,
        thickness,
        36,
        1,
        false,
        0,
        Math.PI * 1.5 // 270° cutaway reveals geological strata profile
      );
      const layerMat = new THREE.MeshStandardMaterial({
        color: layerColors[i],
        roughness: 0.75,
        metalness: 0.08,
        transparent: true,
        opacity: 0.94,
      });
      const layerMesh = new THREE.Mesh(layerGeo, layerMat);
      layerMesh.position.y = currentY - thickness / 2;
      rigGroup.add(layerMesh);
      currentY -= thickness;
    });

    // 7. Stylized Drilling Derrick in Deep Petroleum (#142B3A)
    const derrickMat = new THREE.MeshStandardMaterial({
      color: 0x142b3a,
      roughness: 0.35,
      metalness: 0.65,
    });

    // Substructure Platform
    const baseGeo = new THREE.BoxGeometry(3.0, 0.9, 3.0);
    const baseMesh = new THREE.Mesh(baseGeo, derrickMat);
    baseMesh.position.y = 0.65;
    rigGroup.add(baseMesh);

    // Derrick 4 Tapered Lattice Columns
    const legGeo = new THREE.CylinderGeometry(0.07, 0.14, 6.5, 8);
    const legPositions = [
      [1.15, 4.0, 1.15],
      [-1.15, 4.0, 1.15],
      [1.15, 4.0, -1.15],
      [-1.15, 4.0, -1.15],
    ];

    legPositions.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, derrickMat);
      leg.position.set(x * 0.68, y, z * 0.68);
      leg.rotation.z = x > 0 ? 0.09 : -0.09;
      leg.rotation.x = z > 0 ? -0.09 : 0.09;
      rigGroup.add(leg);
    });

    // Copper Flame Cross Braces (#D96B3B)
    const orangeMat = new THREE.MeshStandardMaterial({
      color: 0xd96b3b,
      roughness: 0.3,
      metalness: 0.5,
    });

    [2.2, 3.8, 5.4].forEach((levelY) => {
      const frameGeo = new THREE.BoxGeometry(
        1.8 * (1 - levelY * 0.07),
        0.09,
        1.8 * (1 - levelY * 0.07)
      );
      const frame = new THREE.Mesh(frameGeo, orangeMat);
      frame.position.y = levelY;
      rigGroup.add(frame);
    });

    // Crown Block (Top of Rig)
    const crownGeo = new THREE.BoxGeometry(1.0, 0.45, 1.0);
    const crown = new THREE.Mesh(crownGeo, derrickMat);
    crown.position.y = 7.4;
    rigGroup.add(crown);

    // 8. 3D Wellbore Spline Trajectory (Copper Flame #D96B3B)
    const curvePoints = [
      new THREE.Vector3(0, 0.65, 0),
      new THREE.Vector3(0, -3.2, 0),
      new THREE.Vector3(0.5, -6.5, 0.3),
      new THREE.Vector3(1.6, -9.8, 0.9),
      new THREE.Vector3(3.4, -12.8, 2.0),
    ];
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const tubeGeo = new THREE.TubeGeometry(curve, 72, 0.18, 12, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0xd96b3b,
      emissive: 0xa9533d,
      emissiveIntensity: 0.7,
      roughness: 0.25,
    });
    const wellboreTube = new THREE.Mesh(tubeGeo, tubeMat);
    rigGroup.add(wellboreTube);

    // Transparent Casing Wireframe Guide
    const casingGeo = new THREE.TubeGeometry(curve, 72, 0.28, 12, false);
    const casingMat = new THREE.MeshBasicMaterial({
      color: 0xf5f0e6,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const casingMesh = new THREE.Mesh(casingGeo, casingMat);
    rigGroup.add(casingMesh);

    // 9. Active Rotating Drill Bit at Target Depth
    const bitPos = curve.getPoint(1);
    const bitGeo = new THREE.ConeGeometry(0.35, 0.65, 12);
    const bitMat = new THREE.MeshStandardMaterial({
      color: 0xd96b3b,
      metalness: 0.85,
      roughness: 0.2,
      emissive: 0xa9533d,
      emissiveIntensity: 0.8,
    });
    const bitMesh = new THREE.Mesh(bitGeo, bitMat);
    bitMesh.position.copy(bitPos);
    bitMesh.rotation.x = Math.PI * 0.75;
    bitMesh.rotation.z = -Math.PI * 0.22;
    rigGroup.add(bitMesh);

    // Pulsing Depth Ring
    const ringGeo = new THREE.RingGeometry(0.42, 0.6, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xd96b3b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const depthRing = new THREE.Mesh(ringGeo, ringMat);
    depthRing.position.copy(bitPos);
    depthRing.rotation.x = Math.PI / 2;
    rigGroup.add(depthRing);

    // 10. Data Particles Traveling Down the Wellbore
    const particleCount = 28;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleProgress = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particleProgress[i] = i / particleCount;
      const pt = curve.getPoint(particleProgress[i]);
      particlePositions[i * 3] = pt.x;
      particlePositions[i * 3 + 1] = pt.y;
      particlePositions[i * 3 + 2] = pt.z;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xd96b3b,
      size: 0.22,
      transparent: true,
      opacity: 0.95,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    rigGroup.add(particleSystem);

    // 11. Mouse Parallax & Idle Floating Animation Loop
    let animationId: number;
    const startTime = performance.now();
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / width - 0.5;
      const y = (e.clientY - rect.top) / height - 0.5;
      mouseX = x * 0.35;
      mouseY = y * 0.25;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Slow elegant rotation + mouse parallax response
      targetRotationY = Math.sin(elapsedTime * 0.2) * 0.12 + mouseX;
      targetRotationX = Math.cos(elapsedTime * 0.18) * 0.04 + mouseY;

      rigGroup.rotation.y += (targetRotationY - rigGroup.rotation.y) * 0.04;
      rigGroup.rotation.x += (targetRotationX - rigGroup.rotation.x) * 0.04;

      // Pulse Depth Ring
      const scale = 1 + Math.sin(elapsedTime * 2.8) * 0.14;
      depthRing.scale.set(scale, scale, scale);

      // Rotate Drill Bit
      bitMesh.rotation.y += 0.09;

      // Move telemetry particles along wellbore curve
      const posAttr = particleGeo.getAttribute("position") as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        particleProgress[i] += 0.0035;
        if (particleProgress[i] > 1) particleProgress[i] = 0;
        const pt = curve.getPoint(particleProgress[i]);
        posAttr.setXYZ(i, pt.x, pt.y, pt.z);
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[520px] lg:h-[600px] flex items-center justify-center select-none">
      {/* Three.js Canvas Container */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
        title="Interactive 3D Subsurface Wellbore Model (Move cursor to orbit)"
      />

      {/* Floating Telemetry Badge 1: Depth */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: [0, -6, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.2 },
          y: { duration: 4.2, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute top-8 right-2 sm:right-6 bg-[#F5F0E6]/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-[#DDD2C0] shadow-sm flex items-center gap-3 z-10 pointer-events-none text-left"
      >
        <div className="h-8 w-8 rounded-lg bg-[#142B3A] flex items-center justify-center text-[#D96B3B]">
          <Activity className="h-4 w-4" />
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#142B3A]/70 block font-semibold">
            Bit Depth (MD)
          </span>
          <span className="text-sm font-bold font-mono text-[#0D1B24]">
            3,240.0 m
          </span>
        </div>
      </motion.div>

      {/* Floating Telemetry Badge 2: ROP */}
      <motion.div
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: [0, 5, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.4 },
          x: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
        }}
        className="absolute top-24 left-2 sm:left-4 bg-[#F5F0E6]/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-[#DDD2C0] shadow-sm flex items-center gap-3 z-10 pointer-events-none text-left"
      >
        <div className="h-8 w-8 rounded-lg bg-[#D96B3B]/15 flex items-center justify-center text-[#A9533D]">
          <Gauge className="h-4 w-4" />
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#142B3A]/70 block font-semibold">
            ROP Live
          </span>
          <span className="text-sm font-bold font-mono text-[#0D1B24]">
            18.5 m/h
          </span>
        </div>
      </motion.div>

      {/* Floating Telemetry Badge 3: WOB */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.6 },
          y: { duration: 4.6, repeat: Infinity, ease: "easeInOut", delay: 1 },
        }}
        className="absolute bottom-20 left-4 sm:left-8 bg-[#F5F0E6]/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-[#DDD2C0] shadow-sm flex items-center gap-3 z-10 pointer-events-none text-left"
      >
        <div className="h-8 w-8 rounded-lg bg-[#DDD2C0]/60 flex items-center justify-center text-[#142B3A]">
          <Disc className="h-4 w-4" />
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#142B3A]/70 block font-semibold">
            Weight on Bit
          </span>
          <span className="text-sm font-bold font-mono text-[#0D1B24]">
            85 kN
          </span>
        </div>
      </motion.div>

      {/* Floating Telemetry Badge 4: Mud Flow & Connection */}
      <motion.div
        initial={{ opacity: 0, x: 15 }}
        animate={{ opacity: 1, x: [0, -5, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.8 },
          x: { duration: 5.4, repeat: Infinity, ease: "easeInOut", delay: 1.5 },
        }}
        className="absolute bottom-10 right-4 sm:right-8 bg-[#F5F0E6]/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-[#DDD2C0] shadow-sm flex items-center gap-3 z-10 pointer-events-none text-left"
      >
        <div className="h-8 w-8 rounded-lg bg-[#D96B3B]/15 flex items-center justify-center text-[#A9533D]">
          <Droplets className="h-4 w-4" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#142B3A]/70 font-semibold">
              Mud Circulation
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#2F8068]" />
          </div>
          <span className="text-sm font-bold font-mono text-[#0D1B24]">
            820 L/min
          </span>
        </div>
      </motion.div>

      {/* Bottom Geological Strata Legend Label */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[#F5F0E6]/90 backdrop-blur-xs px-3.5 py-1 rounded-full border border-[#DDD2C0] text-[10px] font-mono text-[#142B3A]/80 flex items-center gap-2 pointer-events-none shadow-xs">
        <Radio className="h-3 w-3 text-[#D96B3B] animate-pulse" />
        <span>Subsurface Strata: Barail Shale &rarr; Jurassic Pay Zone</span>
      </div>
    </div>
  );
}
