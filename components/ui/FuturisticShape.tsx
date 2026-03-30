'use client';

import React from 'react';
import Image from 'next/image';
import styles from './FuturisticShape.module.css';

interface FuturisticShapeProps {
  name: string; // e.g., 'shape1', 'shape3', etc.
  className?: string; // Optional class for positioning
  style?: React.CSSProperties; // Optional inline style
  width?: number;
  height?: number;
}

/**
 * Component to display futuristic shapes from individual assets.
 * The shapes are sourced from /public/images/assets/
 */
const FuturisticShape: React.FC<FuturisticShapeProps> = ({ 
  name, 
  className = '', 
  style,
  width = 100,
  height = 100 
}) => {
  return (
    <div 
      className={`${styles.shapeContainer} ${className}`}
      style={style}
      aria-hidden="true"
    >
      <Image
        src={`/images/assets/${name}.png`}
        alt=""
        width={width}
        height={height}
        className={styles.shapeImage}
      />
    </div>
  );
};

export default FuturisticShape;
