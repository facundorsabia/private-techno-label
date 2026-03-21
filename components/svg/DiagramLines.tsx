'use client';

import React from 'react';

export default function DiagramLines({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      {/* Connecting lines */}
      <line x1="50" y1="20" x2="50" y2="380" stroke="#e8e8e8" strokeWidth="0.3" opacity="0.08" />
      <line x1="550" y1="20" x2="550" y2="380" stroke="#e8e8e8" strokeWidth="0.3" opacity="0.08" />
      <line x1="20" y1="50" x2="580" y2="50" stroke="#e8e8e8" strokeWidth="0.3" opacity="0.06" />
      <line x1="20" y1="350" x2="580" y2="350" stroke="#e8e8e8" strokeWidth="0.3" opacity="0.06" />

      {/* Diagonal connector */}
      <line x1="100" y1="60" x2="500" y2="340" stroke="#E8550F" strokeWidth="0.3" opacity="0.06" strokeDasharray="8 12" />

      {/* Small indicator circles */}
      <circle cx="50" cy="50" r="3" stroke="#E8550F" strokeWidth="0.5" opacity="0.3" fill="none" />
      <circle cx="550" cy="50" r="3" stroke="#e8e8e8" strokeWidth="0.5" opacity="0.2" fill="none" />
      <circle cx="50" cy="350" r="3" stroke="#e8e8e8" strokeWidth="0.5" opacity="0.2" fill="none" />
      <circle cx="550" cy="350" r="3" stroke="#E8550F" strokeWidth="0.5" opacity="0.3" fill="none" />

      {/* Small tick marks */}
      {[100, 200, 300, 400, 500].map((x) => (
        <line key={`tick-${x}`} x1={x} y1="48" x2={x} y2="52" stroke="#e8e8e8" strokeWidth="0.4" opacity="0.15" />
      ))}

      {/* Cross markers */}
      <g opacity="0.15">
        <line x1="297" y1="195" x2="303" y2="205" stroke="#E8550F" strokeWidth="0.5" />
        <line x1="303" y1="195" x2="297" y2="205" stroke="#E8550F" strokeWidth="0.5" />
      </g>
    </svg>
  );
}
