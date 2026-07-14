'use client';

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import styles from './AudioPlayer.module.css';

interface AudioPlayerProps {
  currentTrack: {
    title: string;
    num: string;
    url: string;
  } | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export default function AudioPlayer({ currentTrack, onClose, onNext, onPrev }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Animation for mounting/unmounting
  useGSAP(() => {
    if (currentTrack && containerRef.current) {
      gsap.to(containerRef.current, {
        y: 0,
        duration: 0.5,
        ease: 'power3.out'
      });
    } else if (!currentTrack && containerRef.current) {
      gsap.to(containerRef.current, {
        y: '100%',
        duration: 0.4,
        ease: 'power3.in'
      });
    }
  }, [currentTrack]);

  // Handle track change
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.url;
      audioRef.current.load();
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => console.log('Audio playback failed:', err));
    } else if (!currentTrack && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [currentTrack]);

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.log(err));
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const dur = audioRef.current.duration || 0;
    
    setCurrentTime(current);
    setDuration(dur);
    
    if (dur > 0) {
      const percentage = (current / dur) * 100;
      setProgress(percentage);
      
      // Animate progress bar width smoothly with GSAP
      if (progressBarRef.current) {
        gsap.to(progressBarRef.current, {
          width: `${percentage}%`,
          duration: 0.1,
          ease: 'none'
        });
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    
    const bounds = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - bounds.left) / bounds.width;
    audioRef.current.currentTime = percent * duration;
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (onNext) {
      onNext();
    }
  };

  return (
    <div className={styles.playerContainer} ref={containerRef}>
      <audio 
        ref={audioRef} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={handleTimeUpdate}
      />
      
      {currentTrack && (
        <>
          <div className={styles.trackInfo}>
            <span className={styles.trackNum}>{currentTrack.num}</span>
            <span className={styles.trackTitle}>{currentTrack.title}</span>
          </div>

          <div className={styles.controlsContainer}>
            <button className={styles.playPauseBtn} onClick={togglePlay}>
              {isPlaying ? '||' : '▶'}
            </button>
            
            <div className={styles.progressContainer}>
              <span className={styles.time}>{formatTime(currentTime)}</span>
              <div className={styles.progressBarWrapper} onClick={handleSeek}>
                <div className={styles.progressBar} ref={progressBarRef}></div>
              </div>
              <span className={styles.time}>{formatTime(duration)}</span>
            </div>
          </div>

          <button className={styles.closeBtn} onClick={onClose}>
            &times;
          </button>
        </>
      )}
    </div>
  );
}
