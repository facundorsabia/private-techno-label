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

interface PaletteColors {
  accentRGB: [number, number, number];
  mouseRGB: [number, number, number];
  mouseHex: string;
  baseRGB: [number, number, number];
}

const PALETTES: Record<string, PaletteColors> = {
  orange: {
    accentRGB: [232, 85, 15],
    mouseRGB: [183, 72, 41],
    mouseHex: '#b74829',
    baseRGB: [255, 255, 255],
  },
  acid: {
    accentRGB: [57, 255, 20],
    mouseRGB: [39, 219, 12],
    mouseHex: '#27db0c',
    baseRGB: [255, 255, 255],
  },
  cyan: {
    accentRGB: [0, 240, 255],
    mouseRGB: [0, 180, 220],
    mouseHex: '#00b4dc',
    baseRGB: [255, 255, 255],
  },
  crimson: {
    accentRGB: [255, 10, 40],
    mouseRGB: [200, 5, 30],
    mouseHex: '#c8051e',
    baseRGB: [255, 255, 255],
  },
  amber: {
    accentRGB: [255, 176, 0],
    mouseRGB: [215, 140, 0],
    mouseHex: '#d78c00',
    baseRGB: [255, 255, 255],
  },
  monochrome: {
    accentRGB: [255, 255, 255],
    mouseRGB: [180, 180, 180],
    mouseHex: '#b4b4b4',
    baseRGB: [100, 100, 100],
  }
};

interface AudioReactiveSphereProps {
  analyserRef: React.MutableRefObject<AnalyserNode | null>;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
  resolutionMultiplier?: number;
  backgroundImage?: string | null;
  bgOpacity?: number;
  activeTitleText?: string;
  titleYOffset?: number;
  titleScale?: number;
  showLogo?: boolean;
  showTitleText?: boolean;
  colorPalette?: string;
  showHudGrid?: boolean;
  sensitivity?: number;
  bassMultiplier?: number;
  midMultiplier?: number;
  trebleMultiplier?: number;
  rotationMultiplier?: number;
  particleSizeMultiplier?: number;
  reactiveColor?: boolean;
  reactionMode?: 'pulse' | 'deform' | 'orbit' | 'explode';
  lockedState?: number | null;
  cameraEffects?: boolean;
  customLogo?: string | null;
  autoCycleDuration?: number;
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
  showLogo = true,
  showTitleText = true,
  colorPalette = 'orange',
  showHudGrid = true,
  sensitivity = 1,
  bassMultiplier = 1,
  midMultiplier = 1,
  trebleMultiplier = 1,
  rotationMultiplier = 1,
  particleSizeMultiplier = 1,
  reactiveColor = true,
  reactionMode = 'deform',
  lockedState = null,
  cameraEffects = true,
  customLogo = null,
  autoCycleDuration = 120,
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

  // Pre-load static brand logo or uploaded custom logo
  useEffect(() => {
    const img = new Image();
    img.src = customLogo || '/images/logos/private-rebranding-logo-no-bg.png';
    img.onload = () => {
      logoImageRef.current = img;
    };
  }, [customLogo]);

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
    showLogo,
    showTitleText,
    showHudGrid,
    colorPalette,
    cameraEffects,
    customLogo,
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
      showLogo,
      showTitleText,
      showHudGrid,
      colorPalette,
      cameraEffects,
      customLogo,
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
    showLogo,
    showTitleText,
    showHudGrid,
    colorPalette,
    cameraEffects,
    customLogo,
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

    // Handle Resize (with device pixel ratio support & ResizeObserver for exact aspect ratio captures)
    const handleResize = () => {
      const baseDpr = window.devicePixelRatio || 1;
      const dpr = baseDpr * (propsRef.current.resolutionMultiplier || 1.0);
      const targetElement = canvas.parentElement || canvas;
      const rect = targetElement.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.scale(dpr, dpr);
      
      sizeRef.current = { width: rect.width, height: rect.height };
      radiusRef.current = Math.min(rect.width, rect.height) * 0.34;
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    // Rotation angles
    let angleY = 0;
    let angleX = 0;
    let animFrameId = 0;

    // Smooth color palette transition tracking variables
    let curAccentRGB: [number, number, number] = [232, 85, 15];
    let curMouseRGB: [number, number, number] = [183, 72, 41];
    let curBaseRGB: [number, number, number] = [255, 255, 255];

    // Smooth manual transition tracking variables
    let lastTargetState: number | null = null;
    let manualFromState = 0;
    let manualToState = 0;
    let manualMorphProgress = 1.0;
    let lastTime = Date.now();

    // Mathematical definition for target positions of each state

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
      effMidVal: number,
      effTrebleVal: number = 0,
      effBassVal: number = 0,
      freqData: any = null
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

        case 1: // Merkaba (Star Tetrahedron)
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

        case 2: // Metatron's Cube
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

        case 3: // 3D Maze Orthogonal Grid
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

        case 4: // Sri Yantra (9 Interlocking Triangles)
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

        case 5: // Spiral Star Vortex
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

        case 6: // Renahedron 4: Stellated Octahedron
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

        case 7: // Escher's Cube Compound
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

        case 8: // 64-Star Tetrahedron Cluster
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

        case 9: // Hexaedro (3D Cube)
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

        case 10: // Horizontal Synthesizer Oscilloscope Wave
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

        case 11: // Flower of Life
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

        case 12: // Double Helix DNA
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

        case 13: // Bioluminescent Jellyfish (Medusa)
          {
            const bellRatio = 0.48; // 48% of particles for the umbrella bell
            const splitIndex = Math.floor(numParticles * bellRatio);
            
            // Swim pulse rate
            const swimCycle = time * 3.5;
            // Pulsation contraction/expansion reactive to bass
            const contraction = 1.0 + Math.sin(swimCycle) * 0.18 * (1.0 + effBassVal * 0.45);

            if (i < splitIndex) {
              // 1. Jellyfish Bell (wide hollow mushroom dome)
              const v = (theta / Math.PI) * (Math.PI * 0.58);
              const u = phi;
              
              const rBell = 0.65 * contraction;
              x = rBell * Math.sin(v) * Math.cos(u) * 1.15;
              z = rBell * Math.sin(v) * Math.sin(u) * 1.15;
              
              const rimCurve = Math.sin(v * 2.0) * 0.08;
              y = rBell * Math.cos(v) * 0.45 + rimCurve + 0.35; // Positioned high
            } else {
              // 2. Trailing Tentacles (fine curtain of vertical threads)
              const threadIdx = i % 48; // 48 fine threads
              const baseAngle = (threadIdx / 48) * Math.PI * 2;
              
              // Position along the length of the thread (0 at top, 1 at bottom tip)
              const t = ((i - splitIndex) / (numParticles - splitIndex));
              
              // Threads start at the bell rim radius and hang down
              const rBase = 0.28 + 0.12 * Math.sin(threadIdx * 4.3);
              
              // Wave propagation moving downwards
              const wavePhase = t * 9.0 - swimCycle * 1.5;
              const waveAmp = (0.04 + effMidVal * 0.08) * (t + 0.12);
              
              x = rBase * Math.cos(baseAngle) + Math.sin(wavePhase) * waveAmp;
              z = rBase * Math.sin(baseAngle) + Math.cos(wavePhase) * waveAmp;
              
              // Vertical position dangling down
              y = 0.25 - t * 1.38 + Math.sin(wavePhase) * 0.03;
            }
            
            // Orient head up, tentacles down on screen
            y = -y;
          }
          break;

        case 14: // Möbius Strip
          {
            const u = phi; // 0 to 2*PI
            const v = (theta / Math.PI) * 0.85 - 0.425; // -0.425 to 0.425
            
            const r = 0.85 + v * Math.cos(u * 0.5);
            x = r * Math.cos(u);
            z = r * Math.sin(u);
            y = v * Math.sin(u * 0.5);
          }
          break;

        case 15: // Torus Knot (3, 8)
          {
            const u = phi + (theta / Math.PI) * 0.05;
            const p = 3;
            const q = 8;
            
            const r = 0.75 + 0.28 * Math.cos(q * u);
            x = r * Math.cos(p * u);
            z = r * Math.sin(p * u);
            y = 0.28 * Math.sin(q * u);
          }
          break;

        case 16: // Black Hole Singularity
          {
            // Accretion disk radius from 0.08 to 1.35
            const r = 0.08 + (theta / Math.PI) * 1.27;
            const twistAngle = phi + r * 3.5 - time * 1.5;
            
            x = r * Math.cos(twistAngle);
            z = r * Math.sin(twistAngle);
            // Funnel plunges deep near the center
            y = -0.065 / (r + 0.035);
          }
          break;

        case 17: // 3D Spectrum Ring (Equalizercolumns arranged in circle)
          {
            const numCols = 32;
            const colIdx = i % numCols;
            const rowIdx = Math.floor(i / numCols);
            const totalRows = Math.floor(numParticles / numCols) || 1;
            
            const angle = (colIdx / numCols) * 2 * Math.PI;
            const r = 0.85;
            
            // Read frequency value for this column
            let binValue = 0.3;
            if (freqData && freqData.length > 0) {
              const freqIdx = Math.floor((colIdx / numCols) * (freqData.length * 0.5));
              binValue = freqData[freqIdx] / 255;
            } else {
              binValue = 0.3 + 0.3 * Math.sin(colIdx * 0.4 + time * 4.0);
            }
            
            const heightScale = binValue * sensitivityVal * 1.6;
            const baseHeight = (rowIdx / totalRows) * 0.8 - 0.4;
            
            y = baseHeight * heightScale;
            x = r * Math.cos(angle);
            z = r * Math.sin(angle);
            
            // Add slight bar thickness/depth
            const thickness = 0.045 * Math.sin(phi);
            x += thickness * Math.cos(angle);
            z += thickness * Math.sin(angle);
          }
          break;

        case 18: // Turbulent Nebula (Organic noise cloud)
          {
            // Dense center sphere base
            const rSphere = 0.38;
            const bx = rSphere * sinTheta * Math.cos(phi);
            const by = rSphere * sinTheta * Math.sin(phi);
            const bz = rSphere * cosTheta;
            
            // Pseudo Perlin-noise 3D orbit offsets
            const noiseX = Math.sin(phi * 4.0 + time * 2.2) * Math.cos(theta * 3.0);
            const noiseY = Math.cos(phi * 3.0 - time * 2.0) * Math.sin(theta * 4.0);
            const noiseZ = Math.sin(phi * 5.0 + time * 2.5) * Math.cos(theta * 5.0);
            
            // Disperse particles based on treble + mid energy spikes
            const noiseScale = 0.15 + (effMidVal * 0.5 + effTrebleVal * 0.7) * sensitivityVal;
            
            x = bx + noiseX * noiseScale;
            y = by + noiseY * noiseScale;
            z = bz + noiseZ * noiseScale;
          }
          break;

        case 19: // Alien Kraken (Hypnotic Octopus)
          {
            const numTentacles = 8;
            const headRatio = 0.28; // 28% of particles for the head
            const splitIndex = Math.floor(numParticles * headRatio);

            if (i < splitIndex) {
              // Mantle/Head of the octopus (glowing ellipsoid dome)
              const headRadius = 0.52 + effBassVal * 0.08;
              
              // Map theta to [0, PI/2] so it only goes upwards
              const halfTheta = (theta / Math.PI) * (Math.PI * 0.5);
              
              x = headRadius * Math.sin(halfTheta) * Math.cos(phi) * 0.72;
              y = headRadius * Math.cos(halfTheta) * 0.88 + 0.32; // Shift upwards
              z = headRadius * Math.sin(halfTheta) * Math.sin(phi) * 0.72;
            } else {
              // Tentacles (8 helical wavy arms going downwards and flaring out)
              const tentacleIdx = i % numTentacles;
              const baseAngle = (tentacleIdx / numTentacles) * Math.PI * 2;
              
              // Normalize coordinate along the length of the tentacle (0 = top, 1 = bottom)
              const t = (i - splitIndex) / (numParticles - splitIndex);
              
              // Radial expansion (wider at the bottom, reactive to bass)
              const flare = 0.25 + 0.95 * t * (1.0 + effBassVal * 0.35);
              
              // Helical twisting angle + sine wave wiggling to mids/time
              const wiggleSpeed = time * 3.5;
              const wiggleAmp = 0.08 + effMidVal * 0.12;
              const angle = baseAngle + t * 3.8 + Math.sin(t * 7.5 - wiggleSpeed) * wiggleAmp;
              
              x = flare * Math.cos(angle);
              z = flare * Math.sin(angle);
              
              // Vertical coordinate (starting from the base of the head at +0.32 and curving down to -1.0)
              y = 0.32 - t * 1.35 + Math.cos(t * 8.5 - wiggleSpeed) * 0.05;
            }
            
            // Orient head up, tentacles down on screen
            y = -y;
          }
          break;

        case 20: // Lorenz Chaotic Attractor (Chaotic butterfly wings)
          {
            // Parametric double-wing butterfly attractor mapping
            const rButterfly = Math.exp(Math.cos(phi)) - 2.0 * Math.cos(4.0 * phi) + Math.pow(Math.sin(phi / 12.0), 5.0);
            const scale = 0.28 + effMidVal * 0.12;
            const uAngle = (theta / Math.PI) * 2.0 - 1.0;
            
            x = rButterfly * Math.sin(uAngle * Math.PI) * Math.cos(phi) * scale;
            z = rButterfly * Math.sin(uAngle * Math.PI) * Math.sin(phi) * scale;
            y = rButterfly * Math.cos(uAngle * Math.PI) * scale;
            
            // Add high frequency electrical micro-shiver
            if (effTrebleVal > 0.05) {
              const shiver = Math.sin(time * 30.0 + i) * effTrebleVal * 0.08;
              x += shiver;
              y += shiver;
              z += shiver;
            }
          }
          break;

        case 21: // Hyperboloid Tower (Nuclear cooling tower geometry)
          {
            const uDepth = (theta / Math.PI) * 2.0 - 1.0; // -1.0 to 1.0
            const scale = 0.85;
            
            // Hyperboloid of one sheet: radius curves outward at the ends
            const rHyper = 0.45 * Math.sqrt(1.0 + uDepth * uDepth);
            
            // Pulse the middle waist of the hyperboloid to the bass
            const reactiveRadius = rHyper * (1.0 + effBassVal * 0.12 * (1.0 - Math.abs(uDepth)));
            
            x = reactiveRadius * Math.cos(phi);
            z = reactiveRadius * Math.sin(phi);
            y = uDepth * scale;
          }
          break;

        case 22: // Helical Tunnel (Spiraling depth warp)
          {
            const uDepth = (theta / Math.PI) * 2.0 - 1.0; // -1.0 to 1.0
            const twist = uDepth * Math.PI * 5.0 + time * 2.8;
            const rTunnel = 0.72 + (effMidVal * 0.08 * Math.sin(phi * 4.0));
            
            x = rTunnel * Math.cos(phi + twist);
            z = rTunnel * Math.sin(phi + twist);
            y = uDepth * 0.95;
          }
          break;

        case 23: // Super-Ellipsoid (Rounded morphing cube)
          {
            // Morphs from a perfect sphere to a sharp cube depending on exponent n
            // Base n = 1 (sphere). n = 0.1 (sharp cube).
            const nExp = 0.28 + (1.0 - Math.min(0.9, effBassVal * 1.5)) * 1.6;
            
            const cosPhi = Math.cos(phi);
            const sinPhi = Math.sin(phi);
            const cosTheta = Math.cos(theta);
            const sinTheta = Math.sin(theta);
            
            const rScale = 0.76;
            
            const signX = Math.sign(cosTheta) * Math.sign(cosPhi);
            const signY = Math.sign(sinTheta);
            const signZ = Math.sign(cosTheta) * Math.sign(sinPhi);
            
            x = signX * Math.pow(Math.abs(cosTheta), nExp) * Math.pow(Math.abs(cosPhi), nExp) * rScale;
            z = signZ * Math.pow(Math.abs(cosTheta), nExp) * Math.pow(Math.abs(sinPhi), nExp) * rScale;
            y = signY * Math.pow(Math.abs(sinTheta), nExp) * rScale;
            
            // Add treble reactive outer spike fuzz
            if (effTrebleVal > 0.05) {
              const noise = (Math.random() - 0.5) * effTrebleVal * 0.09;
              x += noise;
              y += noise;
              z += noise;
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
        colorPalette = 'orange',
        cameraEffects = true,
      } = propsRef.current;

      const targetPalette = PALETTES[colorPalette] || PALETTES.orange;
      const colorLerpFactor = 0.06;

      curAccentRGB[0] += (targetPalette.accentRGB[0] - curAccentRGB[0]) * colorLerpFactor;
      curAccentRGB[1] += (targetPalette.accentRGB[1] - curAccentRGB[1]) * colorLerpFactor;
      curAccentRGB[2] += (targetPalette.accentRGB[2] - curAccentRGB[2]) * colorLerpFactor;

      curMouseRGB[0] += (targetPalette.mouseRGB[0] - curMouseRGB[0]) * colorLerpFactor;
      curMouseRGB[1] += (targetPalette.mouseRGB[1] - curMouseRGB[1]) * colorLerpFactor;
      curMouseRGB[2] += (targetPalette.mouseRGB[2] - curMouseRGB[2]) * colorLerpFactor;

      curBaseRGB[0] += (targetPalette.baseRGB[0] - curBaseRGB[0]) * colorLerpFactor;
      curBaseRGB[1] += (targetPalette.baseRGB[1] - curBaseRGB[1]) * colorLerpFactor;
      curBaseRGB[2] += (targetPalette.baseRGB[2] - curBaseRGB[2]) * colorLerpFactor;

      const accentStr = `${Math.round(curAccentRGB[0])}, ${Math.round(curAccentRGB[1])}, ${Math.round(curAccentRGB[2])}`;
      const mouseStr = `${Math.round(curMouseRGB[0])}, ${Math.round(curMouseRGB[1])}, ${Math.round(curMouseRGB[2])}`;
      const baseStr = `${Math.round(curBaseRGB[0])}, ${Math.round(curBaseRGB[1])}, ${Math.round(curBaseRGB[2])}`;

      // ── EXTRACT AUDIO DATA ──
      let bass = 0;
      let mid = 0;
      let treble = 0;
      let volume = 0;
      let hasAudio = false;
      let timeDataCached: any = null;
      let freqData: any = null;

      const analyser = analyserRef.current;
      if (analyser) {
        hasAudio = true;
        
        // 1. Frequency data for size / pulsing
        freqData = new Uint8Array(analyser.frequencyBinCount);
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

      // ── CAMERA DYNAMICS (3D PANNING & ZOOM) ──
      const timeSec = time * 0.001;
      const autoZoom = cameraEffects ? (1.0 + Math.sin(timeSec * 0.15) * 0.14) : 1.0;
      const beatZoom = cameraEffects ? (1.0 + (hasAudio ? effBass * 0.16 : 0)) : 1.0;
      const cameraZoom = autoZoom * beatZoom;
      const camPanX = cameraEffects ? Math.sin(timeSec * 0.22) * 0.14 : 0;
      const camPanY = cameraEffects ? Math.cos(timeSec * 0.18) * 0.08 : 0;

      // Absolute canvas clear with solid black background to ensure high-quality, artifact-free video renders
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
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

      // ── USER-CONFIGURABLE UNIFORM MORPHING TIMELINE ──
      const loopDuration = Math.max(12, autoCycleDuration);
      const numStates = 24;
      const phaseDuration = loopDuration / numStates;
      
      const cycleTime = time % loopDuration;
      const phaseIndex = Math.floor(cycleTime / phaseDuration);
      const phaseTime = cycleTime % phaseDuration;

      const transitionDuration = Math.max(0.5, Math.min(3.0, phaseDuration * 0.35));
      let autoMorphWeight = Math.min(1, phaseTime / transitionDuration);
      autoMorphWeight = autoMorphWeight * autoMorphWeight * (3 - 2 * autoMorphWeight);

      // Compute delta time for smooth manual morphing
      const now = Date.now();
      const dt = Math.min(0.1, (now - lastTime) * 0.001);
      lastTime = now;

      let prevState = (phaseIndex - 1 + numStates) % numStates;
      let currState = phaseIndex;
      let morphWeightVal = autoMorphWeight;

      // Handle smooth transition when user locks a shape or switches locked shape
      const targetLock = (lockedState !== null && lockedState !== undefined) ? lockedState : null;
      
      if (targetLock !== lastTargetState) {
        let currentEffectiveFrom = currState;
        if (manualMorphProgress < 1.0) {
          currentEffectiveFrom = manualToState;
        } else if (lastTargetState !== null) {
          currentEffectiveFrom = lastTargetState;
        } else {
          currentEffectiveFrom = phaseIndex;
        }

        manualFromState = currentEffectiveFrom;
        manualToState = targetLock !== null ? targetLock : phaseIndex;
        manualMorphProgress = 0.0;
        lastTargetState = targetLock;
      }

      if (targetLock !== null) {
        if (manualMorphProgress < 1.0) {
          manualMorphProgress = Math.min(1.0, manualMorphProgress + dt / 1.4); // 1.4s smooth cubic morph
        }
        const p = manualMorphProgress;
        const smoothP = p * p * (3 - 2 * p); // Cubic ease-in-out
        
        prevState = manualFromState;
        currState = manualToState;
        morphWeightVal = smoothP;
      } else if (manualMorphProgress < 1.0) {
        // Transition back to auto cycle timeline smoothly
        manualMorphProgress = Math.min(1.0, manualMorphProgress + dt / 1.4);
        const p = manualMorphProgress;
        const smoothP = p * p * (3 - 2 * p);

        prevState = manualFromState;
        currState = phaseIndex;
        morphWeightVal = smoothP;
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
        const posPrev = getPosForState(prevState, p.theta, p.phi, i, time, timeDataCached, sensitivity, effMid, effTreble, effBass, freqData);
        const posCurr = getPosForState(currState, p.theta, p.phi, i, time, timeDataCached, sensitivity, effMid, effTreble, effBass, freqData);

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

        // Shift points by camera pan offsets for 3D parallax
        let cx = rx + camPanX;
        let cy = ry + camPanY;
        let cz = rz;

        let px = cx * currentR * 1.35;
        let py = cy * currentR;
        let pz = cz * currentR;

        // 5. Perspective Projection with Cinematic Zoom
        const safePz = Math.max(-fov + 10, pz);
        const scale = (fov * cameraZoom) / (fov + safePz);
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

      // Connection lines removed for clean particles-only visualization

      // ── DRAW PARTICLES (WITH DEPTH SORTING FOR HYPER-3D perspective occlusion) ──
      const renderList = projected.map((p, idx) => ({ p, orig: particles[idx] }));
      renderList.sort((a, b) => b.p.z - a.p.z); // descending (largest z (back) drawn first, smallest z (front) drawn last)

      for (let i = 0; i < renderList.length; i++) {
        const p = renderList[i].p;
        const orig = renderList[i].orig;
        
        const depthFactor = Math.max(0.04, Math.min(1, 1 - (p.z + baseR) / (baseR * 2)));
        let finalOpacity = p.opacity * depthFactor;
        let fill = `rgba(${baseStr}, ${finalOpacity})`;
        let size = p.size;

        // Apply breathing accent effect if initialized as accent
        if (orig.isOrange) {
          const breath = Math.sin(time * 2.5 + orig.phase) * 0.5 + 0.5;
          finalOpacity = (0.42 + breath * 0.48) * depthFactor;
          
          let accentColorVal = finalOpacity;
          if (reactiveColor && hasAudio) {
            // Flash brighter with treble energy
            accentColorVal = Math.min(1.0, finalOpacity + effTreble * 0.6);
          }
          fill = `rgba(${accentStr}, ${accentColorVal})`;
          size = Math.max(0.4, p.size * (1.1 + breath * 0.8 + (reactiveColor && hasAudio ? effTreble * 1.6 : 0)));
        }

        if (p.isNearMouse) {
          fill = `rgb(${mouseStr})`;
          size = p.size * 1.2;
        } else if (p.blastIntensity > 0.05) {
          const blastAlpha = Math.min(1, p.blastIntensity * 1.5 + finalOpacity);
          fill = `rgba(${accentStr}, ${blastAlpha})`;
          size = p.size * (1 + p.blastIntensity);
        }

        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Glow halo
        if (p.isNearMouse || p.blastIntensity > 0.15) {
          ctx.fillStyle = `rgba(${mouseStr}, 0.25)`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, size * 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 2. Draw Logo & Subtitle Text overlays on top of the particles inside the canvas context
      const { titleYOffset = 0, titleScale = 1.0, activeTitleText = '', showLogo = true, showTitleText = true } = propsRef.current;

      if ((showLogo && logoImageRef.current) || (showTitleText && activeTitleText)) {
        ctx.save();
        
        const logoImg = logoImageRef.current;
        const w = sizeRef.current.width;
        const h = sizeRef.current.height;
        const centerX = w / 2;
        const centerY = h / 2;
        
        const baseLogoWidth = Math.min(w * 0.45, 380);
        const baseLogoHeight = logoImg ? baseLogoWidth * (logoImg.height / logoImg.width) : 50;
        
        const drawLogoWidth = baseLogoWidth * titleScale;
        const drawLogoHeight = baseLogoHeight * titleScale;
        
        const logoX = centerX - drawLogoWidth / 2;
        const baseLogoY = centerY - drawLogoHeight / 2 - 25;
        const logoY = baseLogoY + titleYOffset;
        
        if (showLogo && logoImg) {
          ctx.drawImage(logoImg, logoX, logoY, drawLogoWidth, drawLogoHeight);
        }
        
        if (showTitleText && activeTitleText) {
          const fontSize = Math.max(9, Math.round(11 * titleScale));
          ctx.font = `bold ${fontSize}px monospace`;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.textAlign = 'center';
          
          let spacedTitle = activeTitleText.split('').join(' ');
          const taglineY = showLogo && logoImg ? logoY + drawLogoHeight + 22 : centerY + titleYOffset;
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
      resizeObserver.disconnect();
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
