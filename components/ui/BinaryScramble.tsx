'use client';

import React, { useState, useEffect, useRef } from 'react';

interface BinaryScrambleProps {
  text: string;
  duration?: number;
  delay?: number;
}

export default function BinaryScramble({ text, duration = 1000, delay = 0 }: BinaryScrambleProps) {
  const [displayText, setDisplayText] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let timeout: NodeJS.Timeout;
    let interval: NodeJS.Timeout;

    const startAnimation = () => {
      setIsAnimating(true);
      const startTime = Date.now();
      
      interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const scrambled = text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            // If the character's position is behind the progress, show the real char
            if (index / text.length < progress * 0.8) {
              return char;
            }
            // Otherwise show random binary
            return Math.random() > 0.5 ? '1' : '0';
          })
          .join('');

        setDisplayText(scrambled);

        if (progress === 1) {
          clearInterval(interval);
          setDisplayText(text);
          setIsAnimating(false);
        }
      }, 50);
    };

    timeout = setTimeout(startAnimation, delay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, duration, delay, isVisible]);

  // Render a non-breaking space if empty to ensure the element has height for the IntersectionObserver
  return <span ref={elementRef}>{displayText || '\u00A0'}</span>;
}
