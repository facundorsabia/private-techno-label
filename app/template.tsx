'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function Template({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Pure technical entrance animation (No overlays)
    const tl = gsap.timeline();

    tl.fromTo(containerRef.current, 
      { 
        opacity: 0,
        filter: 'contrast(2) brightness(1.5) blur(5px)',
        y: 5
      },
      { 
        opacity: 1,
        filter: 'contrast(1) brightness(1) blur(0px)',
        y: 0,
        duration: 0.4,
        ease: 'power2.out'
      }
    )
    .fromTo(containerRef.current,
      { x: -2 },
      { x: 2, duration: 0.05, repeat: 3, yoyo: true, ease: 'none' },
      '-=0.3'
    );

  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
}
