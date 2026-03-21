'use client';

import React from 'react';

export default function WireframeGrid({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1000 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMax meet"
      style={{ width: '100%', height: '100%' }}
    >
      {/* Perspective grid – horizontal lines */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
        const y = 100 + i * 35;
        const shrink = i * 30;
        return (
          <line
            key={`h-${i}`}
            x1={50 + shrink}
            y1={y}
            x2={950 - shrink}
            y2={y}
            stroke="#e8e8e8"
            strokeWidth="0.4"
            opacity={0.08 + i * 0.025}
          />
        );
      })}

      {/* Perspective grid – vertical lines */}
      {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((i) => {
        const xTop = 500 + i * 20;
        const xBot = 500 + i * 100;
        return (
          <line
            key={`v-${i}`}
            x1={xTop}
            y1={100}
            x2={xBot}
            y2={380}
            stroke="#e8e8e8"
            strokeWidth="0.4"
            opacity={0.1}
          />
        );
      })}

      {/* Horizon glow */}
      <line x1="0" y1="100" x2="1000" y2="100" stroke="#E8550F" strokeWidth="0.6" opacity="0.15" />

      {/* Corner markers */}
      <rect x="48" y="375" width="6" height="6" stroke="#E8550F" strokeWidth="0.5" opacity="0.2" fill="none" />
      <rect x="946" y="375" width="6" height="6" stroke="#E8550F" strokeWidth="0.5" opacity="0.2" fill="none" />
    </svg>
  );
}
