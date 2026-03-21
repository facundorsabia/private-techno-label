'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
}

interface ScrollAnimationResult {
  ref: React.RefObject<HTMLDivElement | null>;
  isVisible: boolean;
  parallaxOffset: number;
}

export function useScrollAnimation(options: ScrollAnimationOptions = {}): ScrollAnimationResult {
  const { threshold = 0.15, rootMargin = '0px 0px -50px 0px' } = options;
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);

  // Intersection Observer for visibility
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  // Parallax via requestAnimationFrame
  const handleScroll = useCallback(() => {
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementCenter = rect.top + rect.height / 2;
    const offset = (elementCenter - windowHeight / 2) / windowHeight;
    setParallaxOffset(offset * 60);
  }, []);

  useEffect(() => {
    let rafId: number;
    const onScroll = () => {
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll(); // initial

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [handleScroll]);

  return { ref, isVisible, parallaxOffset };
}
