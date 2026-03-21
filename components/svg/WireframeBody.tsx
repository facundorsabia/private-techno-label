'use client';

import React from 'react';

export default function WireframeBody({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 700"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Head */}
      <ellipse cx="200" cy="80" rx="45" ry="55" stroke="#e8e8e8" strokeWidth="0.8" opacity="0.6" />
      <line x1="200" y1="60" x2="200" y2="100" stroke="#e8e8e8" strokeWidth="0.4" opacity="0.3" />
      <line x1="175" y1="80" x2="225" y2="80" stroke="#e8e8e8" strokeWidth="0.4" opacity="0.3" />

      {/* Neck */}
      <line x1="200" y1="135" x2="200" y2="170" stroke="#e8e8e8" strokeWidth="0.8" opacity="0.5" />

      {/* Shoulders */}
      <path d="M200 170 L140 200 L130 210" stroke="#e8e8e8" strokeWidth="0.8" opacity="0.6" />
      <path d="M200 170 L260 200 L270 210" stroke="#e8e8e8" strokeWidth="0.8" opacity="0.6" />

      {/* Torso wireframe */}
      <path d="M140 200 L135 320 L160 400" stroke="#e8e8e8" strokeWidth="0.8" opacity="0.5" />
      <path d="M260 200 L265 320 L240 400" stroke="#e8e8e8" strokeWidth="0.8" opacity="0.5" />
      <line x1="160" y1="400" x2="240" y2="400" stroke="#e8e8e8" strokeWidth="0.6" opacity="0.4" />

      {/* Ribcage lines */}
      <path d="M155 230 Q200 245 245 230" stroke="#e8e8e8" strokeWidth="0.5" opacity="0.3" fill="none" />
      <path d="M150 260 Q200 275 250 260" stroke="#e8e8e8" strokeWidth="0.5" opacity="0.3" fill="none" />
      <path d="M148 290 Q200 305 252 290" stroke="#e8e8e8" strokeWidth="0.5" opacity="0.3" fill="none" />
      <path d="M145 320 Q200 335 255 320" stroke="#e8e8e8" strokeWidth="0.5" opacity="0.25" fill="none" />

      {/* Spine */}
      <line x1="200" y1="170" x2="200" y2="400" stroke="#e8e8e8" strokeWidth="0.4" opacity="0.2" strokeDasharray="4 4" />

      {/* Left arm */}
      <path d="M130 210 L100 300 L80 380 L70 420" stroke="#e8e8e8" strokeWidth="0.8" opacity="0.5" />
      <circle cx="80" cy="380" r="3" stroke="#e8e8e8" strokeWidth="0.5" opacity="0.4" fill="none" />

      {/* Right arm */}
      <path d="M270 210 L300 300 L320 380 L330 420" stroke="#e8e8e8" strokeWidth="0.8" opacity="0.5" />
      <circle cx="320" cy="380" r="3" stroke="#e8e8e8" strokeWidth="0.5" opacity="0.4" fill="none" />

      {/* Pelvis */}
      <path d="M160 400 L180 430 L200 440 L220 430 L240 400" stroke="#e8e8e8" strokeWidth="0.6" opacity="0.4" fill="none" />

      {/* Left leg */}
      <path d="M180 430 L170 520 L165 600 L160 680" stroke="#e8e8e8" strokeWidth="0.8" opacity="0.5" />
      <circle cx="170" cy="520" r="4" stroke="#e8e8e8" strokeWidth="0.5" opacity="0.3" fill="none" />

      {/* Right leg */}
      <path d="M220 430 L230 520 L235 600 L240 680" stroke="#e8e8e8" strokeWidth="0.8" opacity="0.5" />
      <circle cx="230" cy="520" r="4" stroke="#e8e8e8" strokeWidth="0.5" opacity="0.3" fill="none" />

      {/* Technical markers */}
      <circle cx="200" cy="80" r="60" stroke="#E8550F" strokeWidth="0.3" opacity="0.15" fill="none" strokeDasharray="2 6" />
      <circle cx="200" cy="300" r="80" stroke="#E8550F" strokeWidth="0.3" opacity="0.1" fill="none" strokeDasharray="3 8" />

      {/* Annotation lines */}
      <line x1="255" y1="80" x2="310" y2="60" stroke="#E8550F" strokeWidth="0.4" opacity="0.3" />
      <line x1="270" y1="210" x2="320" y2="190" stroke="#e8e8e8" strokeWidth="0.3" opacity="0.2" />
      <line x1="240" y1="400" x2="300" y2="420" stroke="#e8e8e8" strokeWidth="0.3" opacity="0.2" />
    </svg>
  );
}
