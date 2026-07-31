'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor({ targetId }: { targetId?: string }) {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect touch device
    const checkTouch = () => {
      if (typeof window === 'undefined') return false;
      return window.matchMedia('(pointer: coarse)').matches;
    };
    
    if (checkTouch()) {
      setIsTouch(true);
      return;
    }

    const cursor = cursorRef.current;
    if (!cursor) return;

    const checkVisibility = (target: HTMLElement | null) => {
      if (!targetId) return true; // Always visible if no targetId specified
      if (!target) return false;
      const targetElement = document.getElementById(targetId);
      if (targetElement && (targetElement === target || targetElement.contains(target))) {
        return true;
      }
      return false;
    };

    // Follow mouse
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX - 20;
      const y = e.clientY - 20;
      
      if (cursor) {
        cursor.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${isHovered ? 1.35 : 1})`;
      }
      
      const shouldBeVisible = checkVisibility(e.target as HTMLElement);
      if (isVisible !== shouldBeVisible) {
        setIsVisible(shouldBeVisible);
      }
    };

    // Detect hovers on interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.closest('a, button, input, select, textarea, [role="button"]')) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
      
      const shouldBeVisible = checkVisibility(target);
      if (isVisible !== shouldBeVisible) {
        setIsVisible(shouldBeVisible);
      }
    };

    // Fade out cursor when leaving window bounds
    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const shouldBeVisible = checkVisibility(e.target as HTMLElement);
      setIsVisible(shouldBeVisible);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isHovered, isVisible, targetId]);

  // Render nothing on touch screens
  if (isTouch) return null;

  return (
    <>
      <style>{`
        @keyframes rotateReticle {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .reticle-outer {
          transform-origin: 20px 20px;
          animation: rotateReticle 16s linear infinite;
        }
      `}</style>
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          transform: 'translate3d(-100px, -100px, 0)',
          pointerEvents: 'none',
          zIndex: 99999,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.15s ease-out',
          willChange: 'transform',
        }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" style={{ display: 'block' }}>
          {/* 1. Center dot */}
          <circle cx="20" cy="20" r="1.5" fill="#b74829" />
          
          {/* 2. Inner solid circle */}
          <circle cx="20" cy="20" r="6" stroke="#b74829" strokeWidth="0.8" fill="none" />
          
          {/* 3. Outer rotating dashed circle (radius 14px) */}
          <circle
            cx="20"
            cy="20"
            r="14"
            className="reticle-outer"
            stroke="#b74829"
            strokeWidth="0.6"
            strokeDasharray="2 3.5"
            fill="none"
          />
          
          {/* 4. Crosshair ticks pointing outwards from outer circle (white color swap) */}
          <line x1="20" y1="6" x2="20" y2="0" stroke="#ffffff" strokeWidth="0.8" />
          <line x1="20" y1="34" x2="20" y2="40" stroke="#ffffff" strokeWidth="0.8" />
          <line x1="6" y1="20" x2="0" y2="20" stroke="#ffffff" strokeWidth="0.8" />
          <line x1="34" y1="20" x2="40" y2="20" stroke="#ffffff" strokeWidth="0.8" />
        </svg>
      </div>
    </>
  );
}
