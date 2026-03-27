'use client';

import React from 'react';
import styles from './FuturisticShape.module.css';

interface FuturisticShapeProps {
  type: 1 | 2 | 3 | 4 | 5;
  className?: string; // Optional class for positioning
  style?: React.CSSProperties; // Optional inline style
}

/**
 * Component to display futuristic shapes decoded from a sprite sheet.
 * The shapes are sourced from /public/images/assets/shapes.png
 */
const FuturisticShape: React.FC<FuturisticShapeProps> = ({ type, className = '', style }) => {
  return (
    <div 
      className={`${styles.shape} ${styles[`shape${type}`]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
};

export default FuturisticShape;
