'use client';

import React from 'react';

export default function WireframeHand({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 350"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Palm */}
      <path
        d="M100 200 L110 160 L130 120 L160 100 L190 110 L200 160 L195 200 L150 230 Z"
        stroke="#e8e8e8"
        strokeWidth="0.8"
        opacity="0.5"
        fill="none"
      />

      {/* Thumb */}
      <path d="M100 200 L80 180 L65 150 L60 120" stroke="#e8e8e8" strokeWidth="0.8" opacity="0.5" />
      <circle cx="60" cy="120" r="5" stroke="#e8e8e8" strokeWidth="0.5" opacity="0.3" fill="none" />

      {/* Index finger */}
      <path d="M130 120 L125 80 L120 50 L118 25" stroke="#e8e8e8" strokeWidth="0.8" opacity="0.5" />
      <line x1="125" y1="80" x2="135" y2="78" stroke="#e8e8e8" strokeWidth="0.4" opacity="0.3" />

      {/* Middle finger */}
      <path d="M150 105 L148 65 L146 30 L145 10" stroke="#e8e8e8" strokeWidth="0.8" opacity="0.5" />
      <line x1="148" y1="65" x2="158" y2="63" stroke="#e8e8e8" strokeWidth="0.4" opacity="0.3" />

      {/* Ring finger */}
      <path d="M170 110 L172 70 L174 35 L175 18" stroke="#e8e8e8" strokeWidth="0.8" opacity="0.5" />
      <line x1="172" y1="70" x2="182" y2="68" stroke="#e8e8e8" strokeWidth="0.4" opacity="0.3" />

      {/* Pinky */}
      <path d="M190 120 L195 85 L198 55 L200 40" stroke="#e8e8e8" strokeWidth="0.7" opacity="0.4" />

      {/* Wrist */}
      <path d="M100 200 L90 250 L95 290 L110 320" stroke="#e8e8e8" strokeWidth="0.8" opacity="0.4" />
      <path d="M150 230 L160 270 L165 300 L170 330" stroke="#e8e8e8" strokeWidth="0.8" opacity="0.4" />
      <line x1="90" y1="250" x2="160" y2="270" stroke="#e8e8e8" strokeWidth="0.4" opacity="0.2" />

      {/* Tech markers */}
      <circle cx="150" cy="150" r="50" stroke="#E8550F" strokeWidth="0.3" opacity="0.12" fill="none" strokeDasharray="3 6" />
      <line x1="200" y1="160" x2="260" y2="140" stroke="#E8550F" strokeWidth="0.4" opacity="0.25" />
      <text x="265" y="143" fill="#E8550F" fontSize="8" fontFamily="Space Mono, monospace" opacity="0.4">GRIP.SYS</text>
    </svg>
  );
}
