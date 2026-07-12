'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  theta: number; // polar angle (0 to PI)
  phi: number;   // azimuthal angle (0 to 2PI)
  speed: number;  // individual vibration speed
  phase: number;  // individual vibration phase
  opacity: number;
  isOrange?: boolean;
}

interface Connection {
  i: number;
  j: number;
}

interface AudioReactiveSphereProps {
  analyserRef: React.MutableRefObject<AnalyserNode | null>;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
  resolutionMultiplier?: number;
  backgroundImage?: string | null;
  bgOpacity?: number;
  activeTitleText?: string;
  titleYOffset?: number;
  titleScale?: number;
  sensitivity?: number;
  bassMultiplier?: number;
  midMultiplier?: number;
  trebleMultiplier?: number;
  rotationMultiplier?: number;
  particleSizeMultiplier?: number;
  reactiveColor?: boolean;
  reactionMode?: 'pulse' | 'deform' | 'orbit' | 'explode';
  lockedState?: number | null;
}

export default function AudioReactiveSphere({
  analyserRef,
  canvasRef: externalCanvasRef,
  resolutionMultiplier = 1.0,
  backgroundImage = null,
  bgOpacity = 0.2,
  activeTitleText = '',
  titleYOffset = 0,
  titleScale = 1.0,
  sensitivity = 1,
  bassMultiplier = 1,
  midMultiplier = 1,
  trebleMultiplier = 1,
  rotationMultiplier = 1,
  particleSizeMultiplier = 1,
  reactiveColor = true,
  reactionMode = 'deform',
  lockedState = null,
}: AudioReactiveSphereProps) {
  const internalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasRef = externalCanvasRef || internalCanvasRef;
  
  // Track mouse coordinates relative to canvas center
  const mouseRef = useRef({ x: 0, y: 0, active: false, blastMagnitude: 0, blastX: 0, blastY: 0 });
  
  // Scale of the sphere (updated on resize)
  const radiusRef = useRef(150);
  const sizeRef = useRef({ width: 0, height: 0 }); // Cache for performance

  // Image preloading refs
  const logoImageRef = useRef<HTMLImageElement | null>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);

  // Pre-load static brand logo
  useEffect(() => {
    const img = new Image();
    img.src = '/images/logos/private-rebranding-logo-no-bg.png';
    img.onload = () => {
      logoImageRef.current = img;
    };
  }, []);

  // Pre-load uploaded custom background image
  useEffect(() => {
    if (!backgroundImage) {
      bgImageRef.current = null;
      return;
    }
    const img = new Image();
    img.src = backgroundImage;
    img.onload = () => {
      bgImageRef.current = img;
    };
  }, [backgroundImage]);

  // Dispatch a resize event when resolutionMultiplier shifts
  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [resolutionMultiplier]);

  // Keep props in a ref so the draw loop closure can access the latest values on every animation frame
  const propsRef = useRef({
    sensitivity,
    bassMultiplier,
    midMultiplier,
    trebleMultiplier,
    rotationMultiplier,
    particleSizeMultiplier,
    reactiveColor,
    reactionMode,
    lockedState,
    resolutionMultiplier,
    backgroundImage,
    bgOpacity,
    activeTitleText,
    titleYOffset,
    titleScale,
  });

  useEffect(() => {
    propsRef.current = {
      sensitivity,
      bassMultiplier,
      midMultiplier,
      trebleMultiplier,
      rotationMultiplier,
      particleSizeMultiplier,
      reactiveColor,
      reactionMode,
      lockedState,
      resolutionMultiplier,
      backgroundImage,
      bgOpacity,
      activeTitleText,
      titleYOffset,
      titleScale,
    };
  }, [
    sensitivity,
    bassMultiplier,
    midMultiplier,
    trebleMultiplier,
    rotationMultiplier,
    particleSizeMultiplier,
    reactiveColor,
    reactionMode,
    lockedState,
    resolutionMultiplier,
    backgroundImage,
    bgOpacity,
    activeTitleText,
    titleYOffset,
    titleScale,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configuration
    const numParticles = 3180;
    const maxConnectDist = 0.075;
    const particles: Particle[] = [];
    const connections: Connection[] = [];

    // Helper: Initial positions in unit space to calculate initial connections
    const tempPositions: Array<{ x: number; y: number; z: number }> = [];

    // Initialize particles uniformly distributed on the sphere
    for (let i = 0; i < numParticles; i++) {
      const cosTheta = Math.random() * 2 - 1;
      const sinTheta = Math.sqrt(1 - cosTheta * cosTheta);
      const phi = Math.random() * 2 * Math.PI;
      const theta = Math.acos(cosTheta);

      const isOrange = Math.random() < 0.07; // 7% of particles are orange

      particles.push({
        theta,
        phi,
        speed: 1.5 + Math.random() * 3.0,
        phase: Math.random() * Math.PI * 2,
        opacity: 0.25 + Math.random() * 0.55,
        isOrange,
      });

      tempPositions.push({
        x: sinTheta * Math.cos(phi),
        y: sinTheta * Math.sin(phi),
        z: cosTheta
      });
    }

    // Precalculate connections in 3D using initial sphere distribution
    const maxConnectDistSq = maxConnectDist * maxConnectDist;
    let checkedPairs = 0;
    for (let i = 0; i < numParticles; i++) {
      for (let j = i + 1; j < numParticles; j++) {
        checkedPairs++;
        if (checkedPairs > 200000) break;
        
        const dx = tempPositions[i].x - tempPositions[j].x;
        const dy = tempPositions[i].y - tempPositions[j].y;
        const dz = tempPositions[i].z - tempPositions[j].z;
        const distSq = dx * dx + dy * dy + dz * dz;
        
        if (distSq < maxConnectDistSq) {
          connections.push({ i, j });
          if (connections.length >= 3200) break;
        }
      }
      if (connections.length >= 3200 || checkedPairs > 200000) break;
    }

    // Handle Resize (with device pixel ratio support for sharp rendering)
    const handleResize = () => {
      const baseDpr = window.devicePixelRatio || 1;
      const dpr = baseDpr * (propsRef.current.resolutionMultiplier || 1.0);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      
      sizeRef.current = { width: rect.width, height: rect.height };
      radiusRef.current = Math.min(rect.width, rect.height) * 0.34;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Rotation angles
    let angleY = 0;
    let angleX = 0;
    let animFrameId = 0;

    // Mouse position listeners
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      
      mouseRef.current.x = clientX - rect.width / 2;
      mouseRef.current.y = clientY - rect.height / 2;
      mouseRef.current.active = true;
    };

    let lastTouchTime = 0;

    const handleMouseDown = () => {
      if (Date.now() - lastTouchTime < 1000) return;
      mouseRef.current.blastMagnitude = 1.0;
      mouseRef.current.blastX = mouseRef.current.x;
      mouseRef.current.blastY = mouseRef.current.y;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches[0].clientX - rect.left;
        const clientY = e.touches[0].clientY - rect.top;
        mouseRef.current.x = clientX - rect.width / 2;
        mouseRef.current.y = clientY - rect.height / 2;
        mouseRef.current.active = true;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      lastTouchTime = Date.now();
      handleTouchMove(e);
    };

    const handleTouchEnd = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // Mathematical definition for target positions of each state
    const getPosForState = (
      state: number,
      theta: number,
      phi: number,
      i: number,
      time: number,
      timeDataCached: any,
      sensitivityVal: number,
      effMidVal: number
    ) => {
      let x = 0;
      let y = 0;
      let z = 0;

      const cosTheta = Math.cos(theta);
      const sinTheta = Math.sin(theta);

      switch (state) {
        case 0: // Magnetic Wormhole (Hourglass)
          {
            y = cosTheta;
            const wormR = Math.abs(y) * 0.85 + 0.1;
            x = wormR * Math.cos(phi);
            z = wormR * Math.sin(phi);
          }
          break;

        case 1: // Renahedron 1: Pointed Triangular Dome
          {
            const u = theta / Math.PI;
            const v = phi / (2 * Math.PI);
            const face = i % 4;
            const p1x = 0, p1y = -0.95, p1z = 0;
            let p2x, p2y = 0.65, p2z;
            let p3x, p3y = 0.65, p3z;
            
            if (face === 0) {
              p2x = 0.95; p2z = 0;
              p3x = -0.475; p3z = 0.8227;
            } else if (face === 1) {
              p2x = -0.475; p2z = 0.8227;
              p3x = -0.475; p3z = -0.8227;
            } else if (face === 2) {
              p2x = -0.475; p2z = -0.8227;
              p3x = 0.95; p3z = 0;
            } else {
              p2x = 0.95; p2z = 0;
              p3x = -0.475; p3z = 0.8227;
              x = (1 - u) * (-0.475) + u * ((1 - v) * p2x + v * p3x);
              y = 0.65;
              z = (1 - u) * (-0.8227) + u * ((1 - v) * p2z + v * p3z);
              break;
            }
            
            x = (1 - u) * p1x + u * ((1 - v) * p2x + v * p3x);
            y = (1 - u) * p1y + u * ((1 - v) * p2y + v * p3y);
            z = (1 - u) * p1z + u * ((1 - v) * p2z + v * p3z);
          }
          break;

        case 2: // Merkaba (Star Tetrahedron)
          {
            const u = theta / Math.PI;
            const edgeIndex = i % 12;
            let sx, sy, sz;
            let ex, ey, ez;

            if (edgeIndex < 3) {
              sx = 0; sy = 1.1; sz = 0;
              if (edgeIndex === 0) { ex = 0.95; ey = -0.4; ez = 0; }
              else if (edgeIndex === 1) { ex = -0.475; ey = -0.4; ez = 0.8227; }
              else { ex = -0.475; ey = -0.4; ez = -0.8227; }
            } else if (edgeIndex < 6) {
              if (edgeIndex === 3) {
                sx = 0.95; sy = -0.4; sz = 0;
                ex = -0.475; ey = -0.4; ez = 0.8227;
              } else if (edgeIndex === 4) {
                sx = -0.475; sy = -0.4; sz = 0.8227;
                ex = -0.475; ey = -0.4; ez = -0.8227;
              } else {
                sx = -0.475; sy = -0.4; sz = -0.8227;
                ex = 0.95; ey = -0.4; ez = 0;
              }
            } else if (edgeIndex < 9) {
              sx = 0; sy = -1.1; sz = 0;
              const idx = edgeIndex - 6;
              if (idx === 0) { ex = 0.475; ey = 0.4; ez = 0.8227; }
              else if (idx === 1) { ex = -0.95; ey = 0.4; ez = 0; }
              else { ex = 0.475; ey = 0.4; ez = -0.8227; }
            } else {
              const idx = edgeIndex - 9;
              if (idx === 0) {
                sx = 0.475; sy = 0.4; sz = 0.8227;
                ex = -0.95; ey = 0.4; ez = 0;
              } else if (idx === 1) {
                sx = -0.95; sy = 0.4; sz = 0;
                ex = 0.475; ey = 0.4; ez = -0.8227;
              } else {
                sx = 0.475; sy = 0.4; sz = -0.8227;
                ex = 0.475; ey = 0.4; ez = 0.8227;
              }
            }

            x = (1 - u) * sx + u * ex;
            y = (1 - u) * sy + u * ey;
            z = (1 - u) * sz + u * ez;
          }
          break;

        case 3: // Renahedron 2: Y-Star Prism
          {
            const u = theta / Math.PI;
            const v = phi / (2 * Math.PI);
            const face = i % 6;
            const p1x = 0;
            const p1y = face < 3 ? 0.85 : -0.9;
            const p1z = 0;
            const fIdx = face < 3 ? face : face - 3;
            const nextIdx = face < 3 ? (face + 1) % 3 : (face - 2) % 3;
            let p2x, p2y = 0.25, p2z;
            let p3x, p3y = 0.25, p3z;
            
            if (fIdx === 0) { p2x = 1.05; p2z = 0; }
            else if (fIdx === 1) { p2x = -0.525; p2z = 0.9093; }
            else { p2x = -0.525; p2z = -0.9093; }
            
            if (nextIdx === 0) { p3x = 1.05; p3z = 0; }
            else if (nextIdx === 1) { p3x = -0.525; p3z = 0.9093; }
            else { p3x = -0.525; p3z = -0.9093; }

            x = (1 - u) * p1x + u * ((1 - v) * p2x + v * p3x);
            y = (1 - u) * p1y + u * ((1 - v) * p2y + v * p3y);
            z = (1 - u) * p1z + u * ((1 - v) * p2z + v * p3z);
          }
          break;

        case 4: // Metatron's Cube
          {
            const nodeIndex = i % 13;
            let cx = 0, cy = 0, cz = 0;
            
            if (nodeIndex > 0 && nodeIndex <= 6) {
              const angle = ((nodeIndex - 1) * Math.PI) / 3;
              cx = Math.cos(angle) * 0.45;
              cz = Math.sin(angle) * 0.45;
            } else if (nodeIndex > 6) {
              const angle = ((nodeIndex - 7) * Math.PI) / 3;
              cx = Math.cos(angle) * 0.85;
              cz = Math.sin(angle) * 0.85;
            }

            x = cx + sinTheta * Math.cos(phi) * 0.22;
            y = cy + sinTheta * Math.sin(phi) * 0.22;
            z = cz + cosTheta * 0.22;
          }
          break;

        case 5: // 3D Maze Orthogonal Grid
          {
            const corridor = i % 3;
            const gridVal1 = (((Math.floor(i / 3) % 4) - 1.5) * 0.52);
            const gridVal2 = (((Math.floor(i / 12) % 4) - 1.5) * 0.52);
            const u = (theta / Math.PI) * 2 - 1;
            
            if (corridor === 0) {
              x = u * 0.85; y = gridVal1; z = gridVal2;
            } else if (corridor === 1) {
              x = gridVal1; y = u * 0.85; z = gridVal2;
            } else {
              x = gridVal1; y = gridVal2; z = u * 0.85;
            }
          }
          break;

        case 6: // Renahedron 3: Indented Star Pyramid
          {
            const u = theta / Math.PI;
            const v = phi / (2 * Math.PI);
            const face = i % 6;
            const p1x = 0;
            const p1y = face < 3 ? 0.95 : -0.95;
            const p1z = 0;
            const fIdx = face < 3 ? face : face - 3;
            const nextIdx = face < 3 ? (face + 1) % 3 : (face - 2) % 3;
            let p2x, p2z;
            let p3x, p3z;
            
            if (fIdx === 0) { p2x = 1.0; p2z = 0; }
            else if (fIdx === 1) { p2x = -0.5; p2z = 0.866; }
            else { p2x = -0.5; p2z = -0.866; }
            
            if (nextIdx === 0) { p3x = 1.0; p3z = 0; }
            else if (nextIdx === 1) { p3x = -0.5; p3z = 0.866; }
            else { p3x = -0.5; p3z = -0.866; }

            const tx = (1 - u) * p1x + u * ((1 - v) * p2x + v * p3x);
            const tz = (1 - u) * p1z + u * ((1 - v) * p2z + v * p3z);
            const indent = 1 - 0.28 * Math.sin(u * Math.PI) * Math.sin(v * Math.PI);
            
            x = tx * indent;
            y = ((1 - u) * p1y) * indent;
            z = tz * indent;
          }
          break;

        case 7: // Sri Yantra (9 Interlocking Triangles)
          {
            const edgeIndex = i % 27;
            const tIndex = Math.floor(edgeIndex / 3);
            const eIndex = edgeIndex % 3;
            const u = theta / Math.PI;

            let peakY = 0.9 - (tIndex * 0.08);
            let baseY = -0.5 + (tIndex * 0.06);
            let width = 1.15 - (tIndex * 0.09);
            const isUp = tIndex % 2 === 0;

            if (!isUp) {
              peakY = -peakY;
              baseY = -baseY;
            }

            const v0 = { x: 0, y: peakY, z: 0 };
            const v1 = { x: -width / 2, y: baseY, z: 0 };
            const v2 = { x: width / 2, y: baseY, z: 0 };

            let pStart = v0, pEnd = v1;
            if (eIndex === 0) {
              pStart = v0; pEnd = v1;
            } else if (eIndex === 1) {
              pStart = v1; pEnd = v2;
            } else {
              pStart = v2; pEnd = v0;
            }

            x = (1 - u) * pStart.x + u * pEnd.x;
            y = (1 - u) * pStart.y + u * pEnd.y;
            z = (1 - u) * pStart.z + u * pEnd.z + cosTheta * 0.08;
          }
          break;

        case 8: // Spiral Star Vortex
          {
            const layer = i % 10;
            const edge = Math.floor(i / 10) % 12;
            const u = theta / Math.PI;
            const rL = 0.95 * Math.pow(0.84, layer);
            const rotOffset = layer * 0.11;
            const pIdx = Math.floor(edge / 2);
            let sx, sy, ex, ey;
            
            if (edge % 2 === 0) {
              const alpha = pIdx * Math.PI / 3 + rotOffset;
              sx = Math.cos(alpha) * rL;
              sy = Math.sin(alpha) * rL;
              const beta = pIdx * Math.PI / 3 + Math.PI / 6 + rotOffset;
              ex = Math.cos(beta) * rL * 0.577;
              ey = Math.sin(beta) * rL * 0.577;
            } else {
              const beta = pIdx * Math.PI / 3 + Math.PI / 6 + rotOffset;
              sx = Math.cos(beta) * rL * 0.577;
              sy = Math.sin(beta) * rL * 0.577;
              const nextIdx = (pIdx + 1) % 6;
              const alpha = nextIdx * Math.PI / 3 + rotOffset;
              ex = Math.cos(alpha) * rL;
              ey = Math.sin(alpha) * rL;
            }

            x = (1 - u) * sx + u * ex;
            y = (1 - u) * sy + u * ey;
            z = cosTheta * 0.08 + (layer - 4.5) * 0.06;
          }
          break;

        case 9: // Renahedron 4: Stellated Octahedron
          {
            const u = theta / Math.PI;
            const v = phi / (2 * Math.PI);
            const group = i % 8;
            const sx = (group % 2) * 2 - 1;
            const sy = (Math.floor(group / 2) % 2) * 2 - 1;
            const sz = (Math.floor(group / 4) % 2) * 2 - 1;
            const px = sx * 0.95, py = sy * 0.95, pz = sz * 0.95;
            const subFace = i % 3;
            let p2x, p2y, p2z;
            let p3x, p3y, p3z;
            
            if (subFace === 0) {
              p2x = sx * 0.45; p2y = 0; p2z = 0;
              p3x = 0; p3y = sy * 0.45; p3z = 0;
            } else if (subFace === 1) {
              p2x = 0; p2y = sy * 0.45; p2z = 0;
              p3x = 0; p3y = 0; p3z = sz * 0.45;
            } else {
              p3x = sx * 0.45; p3y = 0; p3z = 0;
              p2x = 0; p2y = 0; p2z = sz * 0.45;
            }

            x = (1 - u) * px + u * ((1 - v) * p2x + v * p3x);
            y = (1 - u) * py + u * ((1 - v) * p2y + v * p3y);
            z = (1 - u) * pz + u * ((1 - v) * p2z + v * p3z);
          }
          break;

        case 10: // Escher's Cube Compound
          {
            const group = i % 14;
            const u1 = cosTheta;
            const u2 = phi / Math.PI - 1;
            
            if (group < 6) {
              let cx = 0, cy = 0, cz = 0;
              const dist = 0.52;
              
              if (group === 0) cx = dist;
              else if (group === 1) cx = -dist;
              else if (group === 2) cy = dist;
              else if (group === 3) cy = -dist;
              else if (group === 4) cz = dist;
              else cz = -dist;
              
              const size = 0.22;
              const localFace = Math.floor(Math.abs(u1) * 3) % 3;
              if (localFace === 0) {
                x = cx + size * (u1 > 0 ? 1 : -1);
                y = cy + u1 * size;
                z = cz + u2 * size;
              } else if (localFace === 1) {
                x = cx + u1 * size;
                y = cy + size * (u2 > 0 ? 1 : -1);
                z = cz + u2 * size;
              } else {
                x = cx + u1 * size;
                y = cy + u2 * size;
                z = cz + size * (u1 > 0 ? 1 : -1);
              }
            } else {
              const pIndex = group - 6;
              const sx = (pIndex % 2) * 2 - 1;
              const sy = (Math.floor(pIndex / 2) % 2) * 2 - 1;
              const sz = (Math.floor(pIndex / 4) % 2) * 2 - 1;
              const rayPos = 0.35 + (theta / Math.PI) * 0.5;
              const rx = sx * rayPos;
              const ry = sy * rayPos;
              const rz = sz * rayPos;
              const thickness = (0.85 - rayPos) * 0.35;
              
              x = rx + thickness * Math.cos(phi);
              y = ry + thickness * Math.sin(phi);
              z = rz + thickness * Math.cos(phi + Math.PI / 2);
            }
          }
          break;

        case 11: // Renahedron 5: Spiked Mine / 20-Point Star
          {
            const u = theta / Math.PI;
            const spikeIndex = i % 20;
            let vx = 1, vy = 1, vz = 1;
            const phiG = 1.61803398875;
            const invPhi = 0.61803398875;
            
            if (spikeIndex === 0) { vx = 1; vy = 1; vz = 1; }
            else if (spikeIndex === 1) { vx = -1; vy = 1; vz = 1; }
            else if (spikeIndex === 2) { vx = 1; vy = -1; vz = 1; }
            else if (spikeIndex === 3) { vx = -1; vy = -1; vz = 1; }
            else if (spikeIndex === 4) { vx = 1; vy = 1; vz = -1; }
            else if (spikeIndex === 5) { vx = -1; vy = 1; vz = -1; }
            else if (spikeIndex === 6) { vx = 1; vy = -1; vz = -1; }
            else if (spikeIndex === 7) { vx = -1; vy = -1; vz = -1; }
            else if (spikeIndex === 8) { vx = 0; vy = invPhi; vz = phiG; }
            else if (spikeIndex === 9) { vx = 0; vy = -invPhi; vz = phiG; }
            else if (spikeIndex === 10) { vx = 0; vy = invPhi; vz = -phiG; }
            else if (spikeIndex === 11) { vx = 0; vy = -invPhi; vz = -phiG; }
            else if (spikeIndex === 12) { vx = invPhi; vy = phiG; vz = 0; }
            else if (spikeIndex === 13) { vx = -invPhi; vy = phiG; vz = 0; }
            else if (spikeIndex === 14) { vx = invPhi; vy = -phiG; vz = 0; }
            else if (spikeIndex === 15) { vx = -invPhi; vy = -phiG; vz = 0; }
            else if (spikeIndex === 16) { vx = phiG; vy = 0; vz = invPhi; }
            else if (spikeIndex === 17) { vx = -phiG; vy = 0; vz = invPhi; }
            else if (spikeIndex === 18) { vx = phiG; vy = 0; vz = -invPhi; }
            else { vx = -phiG; vy = 0; vz = -invPhi; }

            const len = Math.sqrt(vx * vx + vy * vy + vz * vz);
            const nx = vx / len;
            const ny = vy / len;
            const nz = vz / len;
            const rayPos = 0.22 + u * 0.72;
            const rx = nx * rayPos;
            const ry = ny * rayPos;
            const rz = nz * rayPos;
            const thickness = (0.94 - rayPos) * 0.28;
            
            x = rx + thickness * Math.cos(phi);
            y = ry + thickness * Math.sin(phi);
            z = rz + thickness * Math.cos(phi + Math.PI / 2);
          }
          break;

        case 12: // 64-Star Tetrahedron Cluster
          {
            const clusterIndex = i % 8;
            const cx = ((clusterIndex % 2) * 2 - 1) * 0.42;
            const cy = (Math.floor(clusterIndex / 2) % 2 * 2 - 1) * 0.42;
            const cz = (Math.floor(clusterIndex / 4) * 2 - 1) * 0.42;
            const u = theta / Math.PI;
            const edgeIndex = i % 12;
            let sx, sy, sz;
            let ex, ey, ez;

            if (edgeIndex < 3) {
              sx = 0; sy = 0.45; sz = 0;
              if (edgeIndex === 0) { ex = 0.38; ey = -0.15; ez = 0; }
              else if (edgeIndex === 1) { ex = -0.19; ey = -0.15; ez = 0.329; }
              else { ex = -0.19; ey = -0.15; ez = -0.329; }
            } else if (edgeIndex < 6) {
              if (edgeIndex === 3) {
                sx = 0.38; sy = -0.15; sz = 0;
                ex = -0.19; ey = -0.15; ez = 0.329;
              } else if (edgeIndex === 4) {
                sx = -0.19; sy = -0.15; sz = 0.329;
                ex = -0.19; ey = -0.15; ez = -0.329;
              } else {
                sx = -0.19; sy = -0.15; sz = -0.329;
                ex = 0.38; ey = -0.15; ez = 0;
              }
            } else if (edgeIndex < 9) {
              sx = 0; sy = -0.45; sz = 0;
              const idx = edgeIndex - 6;
              if (idx === 0) { ex = 0.19; ey = 0.15; ez = 0.329; }
              else if (idx === 1) { ex = -0.38; ey = 0.15; ez = 0; }
              else { ex = 0.19; ey = 0.15; ez = -0.329; }
            } else {
              const idx = edgeIndex - 9;
              if (idx === 0) {
                sx = 0.19; sy = 0.15; sz = 0.329;
                ex = -0.38; ey = 0.15; ez = 0;
              } else if (idx === 1) {
                sx = -0.38; sy = 0.15; sz = 0;
                ex = 0.19; ey = 0.15; ez = -0.329;
              } else {
                sx = 0.19; sy = 0.15; sz = -0.329;
                ex = 0.19; ey = 0.15; ez = 0.329;
              }
            }

            x = cx + ((1 - u) * sx + u * ex);
            y = cy + ((1 - u) * sy + u * ey);
            z = cz + ((1 - u) * sz + u * ez);
          }
          break;

        case 13: // Renahedron 6: Compound Cluster
          {
            const group = i % 14;
            const u = theta / Math.PI;
            
            if (group < 6) {
              let px = 0, py = 0, pz = 0;
              const dist = 0.95;
              if (group === 0) px = dist;
              else if (group === 1) px = -dist;
              else if (group === 2) py = dist;
              else if (group === 3) py = -dist;
              else if (group === 4) pz = dist;
              else pz = -dist;
              
              x = px * u;
              y = py * u;
              z = pz * u;
              
              const thickness = (1 - u) * 0.3;
              x += thickness * Math.cos(phi);
              y += thickness * Math.sin(phi);
            } else {
              const pIndex = group - 6;
              const sx = (pIndex % 2) * 2 - 1;
              const sy = (Math.floor(pIndex / 2) % 2) * 2 - 1;
              const sz = (Math.floor(pIndex / 4) % 2) * 2 - 1;
              const cx = sx * 0.45;
              const cy = sy * 0.45;
              const cz = sz * 0.45;

              x = cx + sinTheta * Math.cos(phi) * 0.16;
              y = cy + sinTheta * Math.sin(phi) * 0.16;
              z = cz + cosTheta * 0.16;
            }
          }
          break;

        case 14: // Hexaedro (3D Cube)
          {
            const u1 = cosTheta;
            const u2 = phi / Math.PI - 1;
            const face = i % 6;
            const size = 0.75;
            
            if (face === 0) {
              x = size; y = u1 * size; z = u2 * size;
            } else if (face === 1) {
              x = -size; y = u1 * size; z = u2 * size;
            } else if (face === 2) {
              y = size; x = u1 * size; z = u2 * size;
            } else if (face === 3) {
              y = -size; x = u1 * size; z = u2 * size;
            } else if (face === 4) {
              z = size; x = u1 * size; y = u2 * size;
            } else {
              z = -size; x = u1 * size; y = u2 * size;
            }
          }
          break;

        case 15: // Horizontal Synthesizer Oscilloscope Wave
          {
            const normX = (phi / Math.PI - 1) * 1.15;
            x = normX;
            const envelope = sinTheta;
            
            let audioWaveY = 0;
            if (timeDataCached && timeDataCached.length > 0) {
              const sampleIndex = Math.floor((phi / (2 * Math.PI)) * timeDataCached.length);
              const amp = (timeDataCached[sampleIndex] - 128) / 128; // -1 to 1
              audioWaveY = amp * 0.48 * sensitivityVal;
            } else {
              audioWaveY = 0.28 * Math.sin(normX * 8.5 - time * 8.0);
            }
            
            y = audioWaveY * envelope;
            z = cosTheta * 0.15;
          }
          break;

        case 16: // Wide Concentric Radar Ripple Disk
          {
            const diskR = sinTheta * 1.1;
            x = diskR * Math.cos(phi);
            z = diskR * Math.sin(phi);
            
            let audioRipple = 0;
            if (timeDataCached) {
              audioRipple = 0.18 * Math.sin(diskR * 12 - time * 6.5) * (1.0 + effMidVal * 2.8);
            } else {
              audioRipple = 0.18 * Math.sin(diskR * 12 - time * 6.5);
            }
            y = audioRipple;
          }
          break;

        case 17: // Digital Warp Tunnel
          {
            const baseZ = (theta / Math.PI) * 2 - 1;
            let zDepth = baseZ - (time * 0.4) % 2.0;
            if (zDepth < -1) zDepth += 2.0;
            
            x = 0.7 * Math.cos(phi);
            z = 0.7 * Math.sin(phi);
            y = zDepth;
          }
          break;

        case 18: // Seed of Life Mandala
          {
            const circleIndex = i % 7;
            const rCircle = 0.5;
            let cx = 0, cy = 0;
            
            if (circleIndex < 6) {
              const angle = (circleIndex * Math.PI) / 3;
              cx = Math.cos(angle) * 0.45;
              cy = Math.sin(angle) * 0.45;
            }
            
            x = cx + rCircle * Math.cos(phi);
            y = cy + rCircle * Math.sin(phi);
            z = cosTheta * 0.05;
          }
          break;

        case 19: // Flower of Life
          {
            const circleIndex = i % 19;
            const rCircle = 0.45;
            let cx = 0, cy = 0;

            if (circleIndex > 0 && circleIndex <= 6) {
              const angle = ((circleIndex - 1) * Math.PI) / 3;
              cx = Math.cos(angle) * 0.35;
              cy = Math.sin(angle) * 0.35;
            } else if (circleIndex > 6 && circleIndex <= 12) {
              const angle = ((circleIndex - 7) * Math.PI) / 3;
              cx = Math.cos(angle) * 0.7;
              cy = Math.sin(angle) * 0.7;
            } else if (circleIndex > 12) {
              const angle = ((circleIndex - 13) * Math.PI) / 3 + Math.PI / 6;
              cx = Math.cos(angle) * 0.606;
              cy = Math.sin(angle) * 0.606;
            }

            x = cx + rCircle * Math.cos(phi);
            y = cy + rCircle * Math.sin(phi);
            z = cosTheta * 0.05;
          }
          break;

        case 20: // Double Helix DNA
          {
            const u = theta / Math.PI;
            const yPos = (u * 2 - 1) * 0.95;
            const twist = u * Math.PI * 8; 
            const rot = time * 0.8;
            const r = 0.45;
            const isRung = (i % 8 === 0);
            
            if (isRung) {
              const v = (phi / (Math.PI * 2)) * 2 - 1;
              x = Math.cos(twist + rot) * r * v;
              z = Math.sin(twist + rot) * r * v;
              y = yPos;
            } else {
              const strand = i % 2;
              const angle = twist + (strand * Math.PI) + rot;
              x = Math.cos(angle) * r;
              z = Math.sin(angle) * r;
              y = yPos;
            }
          }
          break;
      }

      return { x, y, z };
    };

    // Animation Loop
    const draw = () => {
      const width = sizeRef.current.width;
      const height = sizeRef.current.height;
      if (width === 0) return; // Wait for initial resize

      const centerX = width / 2;
      const centerY = height / 2;
      const baseR = radiusRef.current;
      const time = Date.now() * 0.001;

      // Extract details from refs to prevent closure locks
      const {
        sensitivity,
        bassMultiplier,
        midMultiplier,
        trebleMultiplier,
        rotationMultiplier,
        particleSizeMultiplier,
        reactiveColor,
        reactionMode,
        lockedState,
      } = propsRef.current;

      // ── EXTRACT AUDIO DATA ──
      let bass = 0;
      let mid = 0;
      let treble = 0;
      let volume = 0;
      let hasAudio = false;
      let timeDataCached: any = null;

      const analyser = analyserRef.current;
      if (analyser) {
        hasAudio = true;
        
        // 1. Frequency data for size / pulsing
        const freqData = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(freqData);

        const bufferLength = analyser.frequencyBinCount;
        
        let bassSum = 0;
        const bassEnd = Math.max(1, Math.floor(bufferLength * 0.08));
        for (let i = 0; i < bassEnd; i++) {
          bassSum += freqData[i];
        }
        bass = (bassSum / bassEnd) / 255;

        let midSum = 0;
        const midStart = bassEnd;
        const midEnd = Math.max(midStart + 1, Math.floor(bufferLength * 0.4));
        for (let i = midStart; i < midEnd; i++) {
          midSum += freqData[i];
        }
        mid = (midSum / (midEnd - midStart)) / 255;

        let trebleSum = 0;
        const trebleStart = midEnd;
        const trebleEnd = Math.max(trebleStart + 1, Math.floor(bufferLength * 0.9));
        for (let i = trebleStart; i < trebleEnd; i++) {
          trebleSum += freqData[i];
        }
        treble = (trebleSum / (trebleEnd - trebleStart)) / 255;

        let totalSum = 0;
        for (let i = 0; i < bufferLength; i++) {
          totalSum += freqData[i];
        }
        volume = (totalSum / bufferLength) / 255;

        // 2. Waveform data for Oscilloscope/Radar ripple caching
        timeDataCached = new Uint8Array(analyser.fftSize);
        analyser.getByteTimeDomainData(timeDataCached);
      }

      const effBass = bass * sensitivity * bassMultiplier;
      const effMid = mid * sensitivity * midMultiplier;
      const effTreble = treble * sensitivity * trebleMultiplier;
      const effVolume = volume * sensitivity;

      // Slow rotation (mostly Y-axis spin, speed increases based on volume)
      const audioSpinY = 0.0012 + (hasAudio ? effVolume * 0.012 * rotationMultiplier : 0);
      const audioSpinX = 0.0004 + (hasAudio ? effVolume * 0.004 * rotationMultiplier : 0);
      angleY += audioSpinY;
      angleX += audioSpinX;

      // Absolute canvas clear
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      // 1. Draw custom background image or tactical lines inside the canvas context
      if (bgImageRef.current) {
        ctx.save();
        ctx.globalAlpha = propsRef.current.bgOpacity ?? 0.2;
        
        const img = bgImageRef.current;
        const imgRatio = img.width / img.height;
        const canvasRatio = sizeRef.current.width / sizeRef.current.height;
        
        let sWidth = img.width;
        let sHeight = img.height;
        let sx = 0;
        let sy = 0;
        
        if (imgRatio > canvasRatio) {
          sWidth = img.height * canvasRatio;
          sx = (img.width - sWidth) / 2;
        } else {
          sHeight = img.width / canvasRatio;
          sy = (img.height - sHeight) / 2;
        }
        
        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, sizeRef.current.width, sizeRef.current.height);
        ctx.restore();
      } else {
        // Draw aesthetic vector grids/diagram lines directly on canvas!
        ctx.save();
        ctx.strokeStyle = 'rgba(232, 232, 232, 0.035)';
        ctx.lineWidth = 0.5;
        
        const w = sizeRef.current.width;
        const h = sizeRef.current.height;
        
        ctx.beginPath();
        // vertical boundaries
        ctx.moveTo(w * 0.08, 0);
        ctx.lineTo(w * 0.08, h);
        ctx.moveTo(w * 0.92, 0);
        ctx.lineTo(w * 0.92, h);
        // horizontal boundaries
        ctx.moveTo(0, h * 0.12);
        ctx.lineTo(w, h * 0.12);
        ctx.moveTo(0, h * 0.88);
        ctx.lineTo(w, h * 0.88);
        ctx.stroke();

        // Diagonal connector
        ctx.strokeStyle = 'rgba(232, 85, 15, 0.025)';
        ctx.beginPath();
        ctx.moveTo(w * 0.16, h * 0.15);
        ctx.lineTo(w * 0.84, h * 0.85);
        ctx.stroke();

        // Center crosshair
        ctx.strokeStyle = 'rgba(232, 85, 15, 0.12)';
        ctx.beginPath();
        ctx.moveTo(w / 2 - 6, h / 2);
        ctx.lineTo(w / 2 + 6, h / 2);
        ctx.moveTo(w / 2, h / 2 - 6);
        ctx.lineTo(w / 2, h / 2 + 6);
        ctx.stroke();
        ctx.restore();
      }

      // Localized Blast Decay
      mouseRef.current.blastMagnitude *= 0.82;

      // React to heavy bass kicks in explode mode by triggering blasts
      if (reactionMode === 'explode' && hasAudio && effBass > 0.65) {
        if (mouseRef.current.blastMagnitude < 0.1) {
          mouseRef.current.blastMagnitude = 1.0;
          mouseRef.current.blastX = (Math.random() - 0.5) * baseR * 0.9;
          mouseRef.current.blastY = (Math.random() - 0.5) * baseR * 0.9;
        }
      }

      // ── DRAW TECHNO HUD GRID / RADAR SCAN ──
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;

      const maxRadiusX = centerX * 0.95;
      const outerRadiusX = Math.min(baseR * 1.25 * 1.35, maxRadiusX);
      const innerRadiusX = Math.min(baseR * 0.7 * 1.35, maxRadiusX * 0.85);

      // Outer dashed boundary ellipse
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, outerRadiusX, baseR * 1.25, 0, 0, Math.PI * 2);
      ctx.setLineDash([2, 16]);
      ctx.stroke();

      // Inner dashed target ellipse
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, innerRadiusX, baseR * 0.7, 0, 0, Math.PI * 2);
      ctx.setLineDash([1, 20]);
      ctx.stroke();

      // Horizontal and vertical axis lines
      ctx.beginPath();
      ctx.setLineDash([3, 14]);
      const lineExtX = Math.min(baseR * 1.4 * 1.35, centerX * 0.98);
      ctx.moveTo(centerX - lineExtX, centerY);
      ctx.lineTo(centerX + lineExtX, centerY);
      ctx.moveTo(centerX, centerY - baseR * 1.3);
      ctx.lineTo(centerX, centerY + baseR * 1.3);
      ctx.stroke();
      ctx.restore();

      // ── 120-SECOND UNIFORM MORPHING TIMELINE ──
      const loopDuration = 126;
      const numStates = 21;
      const phaseDuration = loopDuration / numStates;
      
      const cycleTime = time % loopDuration;
      const phaseIndex = Math.floor(cycleTime / phaseDuration);
      const phaseTime = cycleTime % phaseDuration;

      const transitionDuration = 1.8;
      let morphWeight = Math.min(1, phaseTime / transitionDuration);
      morphWeight = morphWeight * morphWeight * (3 - 2 * morphWeight);

      let prevState = (phaseIndex - 1 + numStates) % numStates;
      let currState = phaseIndex;
      let morphWeightVal = morphWeight;

      if (lockedState !== null && lockedState !== undefined) {
        prevState = lockedState;
        currState = lockedState;
        morphWeightVal = 1.0;
      }

      // ── PROJECT PARTICLES ──
      const projected: Array<{
        x: number;
        y: number;
        z: number;
        size: number;
        isNearMouse: boolean;
        blastIntensity: number;
        opacity: number;
      }> = [];

      const fov = 350;

      for (let i = 0; i < numParticles; i++) {
        const p = particles[i];

        // 1. Calculate target coordinates (takes time-domain and mids)
        const posPrev = getPosForState(prevState, p.theta, p.phi, i, time, timeDataCached, sensitivity, effMid);
        const posCurr = getPosForState(currState, p.theta, p.phi, i, time, timeDataCached, sensitivity, effMid);

        // 2. Morph positions
        let ux = posPrev.x + (posCurr.x - posPrev.x) * morphWeightVal;
        let uy = posPrev.y + (posCurr.y - posPrev.y) * morphWeightVal;
        let uz = posPrev.z + (posCurr.z - posPrev.z) * morphWeightVal;

        // Apply audio reactions before rotation
        if (hasAudio) {
          if (reactionMode === 'deform') {
            const distFromCenter = Math.sqrt(ux * ux + uy * uy + uz * uz) || 1;
            const dx = ux / distFromCenter;
            const dy = uy / distFromCenter;
            const dz = uz / distFromCenter;
            
            // Mid frequencies create wave ripples on the geometry surface
            const ripple = Math.sin(ux * 7 + uy * 7 + time * 8.5) * effMid * 0.22;
            // Treble frequencies trigger micro-vibrations/noise
            const noise = (Math.random() - 0.5) * effTreble * 0.12;
            
            const displacement = effBass * 0.25 + ripple + noise;
            ux += dx * displacement;
            uy += dy * displacement;
            uz += dz * displacement;
          } else if (reactionMode === 'orbit') {
            // Spin/orbit particles around Y axis based on audio volume
            const orbitAngle = effVolume * 0.75 * Math.sin(p.theta + time * 1.8);
            const cosO = Math.cos(orbitAngle);
            const sinO = Math.sin(orbitAngle);
            const rx_orbit = ux * cosO - uz * sinO;
            const rz_orbit = ux * sinO + uz * cosO;
            ux = rx_orbit;
            uz = rz_orbit;
            uy += effMid * 0.15 * Math.sin(p.phi + time * 2.0);
          } else if (reactionMode === 'pulse') {
            // Uniform breathing scale
            const scaleFactor = 1.0 + effBass * 0.22;
            ux *= scaleFactor;
            uy *= scaleFactor;
            uz *= scaleFactor;
          }
        }

        // 3. Rotate points in 3D
        let rx = ux * Math.cos(angleY) - uz * Math.sin(angleY);
        let rz = ux * Math.sin(angleY) + uz * Math.cos(angleY);

        let ry = uy * Math.cos(angleX) - rz * Math.sin(angleX);
        rz = uy * Math.sin(angleX) + rz * Math.cos(angleX);

        // 4. Frequency vibrations (ambient + bass pulse if audio exists)
        const wave = Math.sin(ux * 4 + uy * 4 + time * 3.0) * 4.5;
        const individualVib = Math.sin(time * p.speed + p.phase) * 1.8;
        
        // Bass kick pulses base sphere size
        const audioBassPulse = hasAudio ? effBass * baseR * 0.28 : 0;
        const currentR = baseR + wave + individualVib + audioBassPulse;

        let px = rx * currentR * 1.35;
        let py = ry * currentR;
        let pz = rz * currentR;

        // 5. Perspective Projection
        const safePz = Math.max(-fov + 10, pz);
        const scale = fov / (fov + safePz);
        let screenX = centerX + px * scale;
        let screenY = centerY + py * scale;

        let blastIntensity = 0;
        const isMobile = width < 768;
        const blastRadius = isMobile ? 60 : 200;
        const blastRadiusSq = blastRadius * blastRadius;

        // Apply Localized Shoot/Dissipate Effect
        if (mouseRef.current.blastMagnitude > 0.01) {
          const dxBlast = screenX - (centerX + mouseRef.current.blastX);
          const dyBlast = screenY - (centerY + mouseRef.current.blastY);
          const distSq = dxBlast * dxBlast + dyBlast * dyBlast;
          
          if (distSq < blastRadiusSq) {
            const distBlast = Math.sqrt(distSq);
            const f = (blastRadius - distBlast) / blastRadius;
            blastIntensity = f * f * mouseRef.current.blastMagnitude;
            
            const invDist = 1 / (distBlast || 1);
            const nx = dxBlast * invDist;
            const ny = dyBlast * invDist;
            
            const scatter = p.speed * 0.4 + 0.6;
            const pushMagnitude = blastIntensity * (isMobile ? 70 : 380) * scatter;
            
            screenX += nx * pushMagnitude;
            screenY += ny * pushMagnitude;
          }
        }

        // 6. Mouse Interactive Distortions
        let isNearMouse = false;
        if (mouseRef.current.active) {
          const dx = screenX - (centerX + mouseRef.current.x);
          const dy = screenY - (centerY + mouseRef.current.y);
          const distSq = dx * dx + dy * dy;

          if (distSq < 9025) {
            isNearMouse = true;
            const dist = Math.sqrt(distSq);
            const force = (95 - dist) * 0.010526;
            
            const invDist = 1 / (dist || 1);
            const nx = dx * invDist;
            const ny = dy * invDist;
            const push = force * 24; 
            
            screenX += nx * push;
            screenY += ny * push;
          }
        }

        // Particle size modulated by prop multiplier and treble spikes
        const sizeAudioBoost = hasAudio ? effTreble * 1.25 * particleSizeMultiplier : 0;
        const size = Math.max(0.18, scale * (0.58 * particleSizeMultiplier + (isNearMouse ? 0.50 : 0) + sizeAudioBoost));

        projected.push({
          x: screenX,
          y: screenY,
          z: pz,
          size,
          isNearMouse,
          blastIntensity,
          opacity: p.opacity,
        });
      }

      // ── DRAW CONNECTIONS (LINES) ──
      ctx.lineWidth = 0.2;
      for (let c = 0; c < connections.length; c++) {
        const { i, j } = connections[c];
        const p1 = projected[i];
        const p2 = projected[j];

        const sDist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        if (sDist > baseR * 1.15) continue;

        const avgZ = (p1.z + p2.z) / 2;
        const depthFactor = Math.max(0, Math.min(1, 1 - (avgZ + baseR) / (baseR * 2)));

        let opacity = 0.05 * depthFactor;
        let color = `rgba(255, 255, 255, ${opacity})`;

        if (p1.isNearMouse || p2.isNearMouse) {
          opacity = 0.36 * depthFactor;
          color = `rgba(183, 72, 41, ${opacity})`;
          ctx.lineWidth = 0.55;
        } else {
          ctx.lineWidth = 0.2;
        }

        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      // ── DRAW PARTICLES (WITH DEPTH SORTING FOR HYPER-3D perspective occlusion) ──
      const renderList = projected.map((p, idx) => ({ p, orig: particles[idx] }));
      renderList.sort((a, b) => b.p.z - a.p.z); // descending (largest z (back) drawn first, smallest z (front) drawn last)

      for (let i = 0; i < renderList.length; i++) {
        const p = renderList[i].p;
        const orig = renderList[i].orig;
        
        const depthFactor = Math.max(0.04, Math.min(1, 1 - (p.z + baseR) / (baseR * 2)));
        let finalOpacity = p.opacity * depthFactor;
        let fill = `rgba(255, 255, 255, ${finalOpacity})`;
        let size = p.size;

        // Apply breathing orange effect if initialized as orange
        if (orig.isOrange) {
          const breath = Math.sin(time * 2.5 + orig.phase) * 0.5 + 0.5;
          finalOpacity = (0.42 + breath * 0.48) * depthFactor;
          
          let orangeColorVal = finalOpacity;
          if (reactiveColor && hasAudio) {
            // Flash brighter with treble energy
            orangeColorVal = Math.min(1.0, finalOpacity + effTreble * 0.6);
          }
          fill = `rgba(232, 85, 15, ${orangeColorVal})`;
          size = Math.max(0.4, p.size * (1.1 + breath * 0.8 + (reactiveColor && hasAudio ? effTreble * 1.6 : 0)));
        }

        if (p.isNearMouse) {
          fill = '#b74829';
          size = p.size * 1.2;
        } else if (p.blastIntensity > 0.05) {
          const blastAlpha = Math.min(1, p.blastIntensity * 1.5 + finalOpacity);
          fill = `rgba(232, 85, 15, ${blastAlpha})`;
          size = p.size * (1 + p.blastIntensity);
        }

        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Glow halo
        if (p.isNearMouse || p.blastIntensity > 0.15) {
          ctx.fillStyle = 'rgba(183, 72, 41, 0.25)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, size * 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 2. Draw Logo & Subtitle Text overlays on top of the particles inside the canvas context
      if (logoImageRef.current) {
        ctx.save();
        
        const logoImg = logoImageRef.current;
        const w = sizeRef.current.width;
        const h = sizeRef.current.height;
        const centerX = w / 2;
        const centerY = h / 2;
        
        const { titleYOffset = 0, titleScale = 1.0, activeTitleText = '' } = propsRef.current;
        
        const baseLogoWidth = Math.min(w * 0.45, 380);
        const baseLogoHeight = baseLogoWidth * (logoImg.height / logoImg.width);
        
        const drawLogoWidth = baseLogoWidth * titleScale;
        const drawLogoHeight = baseLogoHeight * titleScale;
        
        const logoX = centerX - drawLogoWidth / 2;
        const baseLogoY = centerY - drawLogoHeight / 2 - 25;
        const logoY = baseLogoY + titleYOffset;
        
        ctx.drawImage(logoImg, logoX, logoY, drawLogoWidth, drawLogoHeight);
        
        if (activeTitleText) {
          const fontSize = Math.max(9, Math.round(11 * titleScale));
          ctx.font = `bold ${fontSize}px monospace`;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.textAlign = 'center';
          
          let spacedTitle = activeTitleText.split('').join(' ');
          const taglineY = logoY + drawLogoHeight + 22;
          ctx.fillText(spacedTitle, centerX, taglineY);
        }
        
        ctx.restore();
      }

      animFrameId = requestAnimationFrame(draw);
    };

    draw();

    // Clean up events and animation loop on unmount
    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchstart', handleTouchMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        background: 'transparent',
        cursor: 'crosshair',
      }}
    />
  );
}
