'use client';

import React, { useEffect, useRef } from 'react';

export default function MinimalGrid() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      time += 0.002;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;

      const horizon = height * 0.45; // slightly above center
      const fov = 300;

      // Draw horizontal lines moving forward (floor)
      const numLines = 25;
      for (let i = 0; i < numLines; i++) {
        // Perspective progression
        const z = ((i - (time * 15) % 1) / numLines);
        if (z <= 0) continue;

        const scale = fov / (fov + z * 1000);
        const y = horizon + (height - horizon) * scale;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(232, 85, 15, ${0.6 * scale})`; // Orange glow
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw vertical lines (floor)
      const numVertLines = 35;
      const centerX = width / 2;
      for (let i = 0; i < numVertLines; i++) {
        const xProgress = (i / (numVertLines - 1)) - 0.5;
        const startX = centerX + (xProgress * width * 0.5);
        const endX = centerX + (xProgress * width * 3.5);

        ctx.beginPath();
        const grad = ctx.createLinearGradient(0, horizon, 0, height);
        grad.addColorStop(0, 'rgba(232, 85, 15, 0)');
        grad.addColorStop(1, 'rgba(232, 85, 15, 0.5)');
        ctx.strokeStyle = grad;

        ctx.moveTo(startX, horizon);
        ctx.lineTo(endX, height);
        ctx.stroke();
      }

      // Top grid (ceiling)
      for (let i = 0; i < numLines; i++) {
        const z = ((i - (time * 8) % 1) / numLines); // Slower ceiling
        if (z <= 0) continue;

        const scale = fov / (fov + z * 1000);
        const y = horizon - horizon * scale;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * scale})`; // Dim white
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw vertical lines (ceiling)
      for (let i = 0; i < numVertLines; i++) {
        const xProgress = (i / (numVertLines - 1)) - 0.5;
        const startX = centerX + (xProgress * width * 0.5);
        const endX = centerX + (xProgress * width * 3.5);

        ctx.beginPath();
        const grad = ctx.createLinearGradient(0, horizon, 0, 0);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0.08)');
        ctx.strokeStyle = grad;

        ctx.moveTo(startX, horizon);
        ctx.lineTo(endX, 0);
        ctx.stroke();
      }

      // --- Draw Swirling Vortex (Black Hole) ---
      // (Vortex particles removed to keep design ultra minimal)
      // -----------------------------------

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0,
        opacity: 1, // Full presence
        background: 'transparent',
      }}
    />
  );
}
