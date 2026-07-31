'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import DiagramLines from '@/components/svg/DiagramLines';
import FuturisticShape from '@/components/ui/FuturisticShape';
import CustomCursor from '@/components/ui/CustomCursor';
import styles from './VisualCreator.module.css';

// Load AudioReactiveSphere dynamically to prevent SSR Canvas reference errors
const AudioReactiveSphere = dynamic(() => import('@/components/ui/AudioReactiveSphere'), { ssr: false });

const MORPH_STATES = [
  { id: 0, name: 'Magnetic Hourglass' },
  { id: 1, name: 'Merkaba Geometry' },
  { id: 2, name: 'Metatron Cube' },
  { id: 3, name: 'Labyrinth Grid' },
  { id: 4, name: 'Sri Yantra' },
  { id: 5, name: 'Vortex Spiral' },
  { id: 6, name: 'Stellated Octahedron' },
  { id: 7, name: 'Escher Cube' },
  { id: 8, name: '64-Star Cluster' },
  { id: 9, name: '3D Cube Solid' },
  { id: 10, name: 'Oscilloscope Wave' },
  { id: 11, name: 'Flower of Life' },
  { id: 12, name: 'Double Helix DNA' },
  { id: 13, name: 'Biolum Jellyfish' },
  { id: 14, name: 'Möbius Strip' },
  { id: 15, name: 'Torus Knot' },
  { id: 16, name: 'Black Hole' },
  { id: 17, name: '3D Spectrum Ring' },
  { id: 18, name: 'Turbulent Nebula' },
  { id: 19, name: 'Alien Kraken' },
  { id: 20, name: 'Lorenz Attractor' },
  { id: 21, name: 'Hyperboloid Tower' },
  { id: 22, name: 'Helical Tunnel' },
  { id: 23, name: 'Super-Ellipsoid' }
];

// ── Built-in Hypnotic Techno Beat Sequencer ──
class HypnoticSynth {
  ctx: AudioContext;
  analyser: AnalyserNode;
  bpm: number = 135;
  isPlaying: boolean = false;
  
  private schedulerTimer: any = null;
  private nextNoteTime: number = 0.0;
  private currentStep: number = 0;
  private lookahead: number = 25.0; // ms
  private scheduleAheadTime: number = 0.1; // sec
  
  constructor(ctx: AudioContext, analyser: AnalyserNode) {
    this.ctx = ctx;
    this.analyser = analyser;
  }
  
  start() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.nextNoteTime = this.ctx.currentTime;
    this.currentStep = 0;
    
    this.schedulerTimer = setInterval(() => {
      this.scheduler();
    }, this.lookahead);
  }
  
  stop() {
    this.isPlaying = false;
    if (this.schedulerTimer) {
      clearInterval(this.schedulerTimer);
      this.schedulerTimer = null;
    }
  }
  
  private scheduler() {
    while (this.nextNoteTime < this.ctx.currentTime + this.scheduleAheadTime) {
      this.scheduleStep(this.currentStep, this.nextNoteTime);
      this.advanceStep();
    }
  }
  
  private advanceStep() {
    const secondsPerBeat = 60.0 / this.bpm;
    const secondsPerStep = secondsPerBeat / 4; // 16th notes
    this.nextNoteTime += secondsPerStep;
    this.currentStep = (this.currentStep + 1) % 16;
  }
  
  private scheduleStep(step: number, time: number) {
    if (step % 4 === 0) {
      this.playKick(time);
    }
    
    if (step % 4 === 2) {
      this.playHiHat(time);
    }
    
    const notes = [36, 36, 48, 36, 39, 36, 48, 39, 36, 36, 51, 36, 43, 36, 48, 39]; 
    const note = notes[step];
    const activeSteps = [1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1];
    
    if (activeSteps[step]) {
      const freq = this.midiNoteToFreq(note);
      this.playSynth(freq, time);
    }
  }
  
  private midiNoteToFreq(note: number): number {
    return 440 * Math.pow(2, (note - 69) / 12);
  }
  
  private playKick(time: number) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.analyser);
    
    osc.frequency.setValueAtTime(160, time);
    osc.frequency.exponentialRampToValueAtTime(38, time + 0.14);
    
    gain.gain.setValueAtTime(1.2, time);
    gain.gain.linearRampToValueAtTime(0.01, time + 0.24);
    
    osc.start(time);
    osc.stop(time + 0.25);
  }
  
  private playHiHat(time: number) {
    const bufferSize = this.ctx.sampleRate * 0.12; 
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7000, time);
    
    const gain = this.ctx.createGain();
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.analyser);
    
    gain.gain.setValueAtTime(0.24, time);
    gain.gain.exponentialRampToValueAtTime(0.005, time + 0.09);
    
    noise.start(time);
    noise.stop(time + 0.11);
  }
  
  private playSynth(freq: number, time: number) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, time);
    filter.frequency.exponentialRampToValueAtTime(1700, time + 0.05);
    filter.frequency.exponentialRampToValueAtTime(320, time + 0.16);
    filter.Q.setValueAtTime(5.5, time);
    
    gain.gain.setValueAtTime(0.32, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.18);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.analyser);
    
    osc.start(time);
    osc.stop(time + 0.2);
  }
}

export default function VisualCreatorPage() {
  // --- Project Initialization State ---
  const [studioInitialized, setStudioInitialized] = useState(false);

  // --- Particle Sphere Modulators State ---
  const [sensitivity, setSensitivity] = useState(1.0);
  const [bassMultiplier, setBassMultiplier] = useState(1.2);
  const [midMultiplier, setMidMultiplier] = useState(1.0);
  const [trebleMultiplier, setTrebleMultiplier] = useState(1.0);
  const [rotationMultiplier, setRotationMultiplier] = useState(1.0);
  const [particleSizeMultiplier, setParticleSizeMultiplier] = useState(1.0);
  const [reactiveColor, setReactiveColor] = useState(true);
  const [reactionMode, setReactionMode] = useState<'pulse' | 'deform' | 'orbit' | 'explode'>('deform');
  const [colorPalette, setColorPalette] = useState<'orange' | 'acid' | 'cyan' | 'crimson' | 'amber' | 'monochrome'>('orange');
  const [lockedState, setLockedState] = useState<number | null>(null);
  const [cameraEffects, setCameraEffects] = useState(true);
  const [autoCycleDuration, setAutoCycleDuration] = useState(120);

  // --- Custom Title text and position/scale ---
  const [customTitle, setCustomTitle] = useState('');
  const [titleYOffset, setTitleYOffset] = useState(0);
  const [titleScale, setTitleScale] = useState(1.0);
  const [showLogo, setShowLogo] = useState(true);
  const [showTitleText, setShowTitleText] = useState(true);
  const [showHudGrid, setShowHudGrid] = useState(true);

  // --- Custom Background Image ---
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [bgOpacity, setBgOpacity] = useState(0.2);
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(30);

  const trimStartRef = useRef(0);
  const trimEndRef = useRef(30);

  useEffect(() => {
    trimStartRef.current = trimStart;
    trimEndRef.current = trimEnd;
  }, [trimStart, trimEnd]);

  // --- Resolution Rendering Multiplier & Frame Rate ---
  const [resolutionMultiplier, setResolutionMultiplier] = useState(1.5); // Default HD (1.5x dpr)
  const [recordFps, setRecordFps] = useState(60); // Default 60 fps

  // --- Layout Mode State ---
  const [controlLayout, setControlLayout] = useState<'bottom' | 'left' | 'floating'>('bottom');
  const [floatingPosition, setFloatingPosition] = useState({ x: 80, y: 120 });
  const [isMinimized, setIsMinimized] = useState(false);

  // --- Aspect Ratio & Real-time Recording State ---
  const [aspectRatio, setAspectRatio] = useState<'full' | 'ratio169' | 'ratio916' | 'ratio11'>('full');
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [downloadInfo, setDownloadInfo] = useState<{ url: string; filename: string; extension: string } | null>(null);
  const prevDownloadUrlRef = useRef<string | null>(null);

  // --- Auto-Recording on Playback ---
  const [autoRecordMode, setAutoRecordMode] = useState(false);
  const autoRecordRef = useRef(false);

  // --- Audio Elements & Playback State ---
  const [fileName, setFileName] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [synthActive, setSynthActive] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);

  // --- Audio, Drag & Recording Refs ---
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const mediaSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const synthRef = useRef<HypnoticSynth | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const bgFileInputRef = useRef<HTMLInputElement | null>(null);
  const logoFileInputRef = useRef<HTMLInputElement | null>(null);
  const logoSetupInputRef = useRef<HTMLInputElement | null>(null);
  const dragRef = useRef<{ startX: number; startY: number; posX: number; posY: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  
  const recordedChunksRef = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordIntervalRef = useRef<any>(null);

  // Keep auto-record mode updated inside a reference to avoid stale event callback closures
  useEffect(() => {
    autoRecordRef.current = autoRecordMode;
  }, [autoRecordMode]);

  // Reusable stop recording logic
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (recordIntervalRef.current) {
      clearInterval(recordIntervalRef.current);
      recordIntervalRef.current = null;
    }
  }, []);

  const stopRecordingRef = useRef(stopRecording);
  useEffect(() => {
    stopRecordingRef.current = stopRecording;
  }, [stopRecording]);

  // Real-time Canvas Video & Audio stream capture recording
  const startRecording = useCallback(() => {
    // Revoke old URL to free memory
    if (prevDownloadUrlRef.current) {
      URL.revokeObjectURL(prevDownloadUrlRef.current);
      prevDownloadUrlRef.current = null;
    }
    setDownloadInfo(null);

    const isSafari = typeof navigator !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    const canvas = canvasRef.current;
    if (!canvas) {
      alert('Canvas monitor not detected.');
      return;
    }

    // Access audio nodes
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!audioContextRef.current) {
      // If audio was not playing/active yet, init context
      const ctx = new AudioContextClass();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      audioContextRef.current = ctx;
      analyserRef.current = analyser;
    }
    
    const ctx = audioContextRef.current!;
    const analyser = analyserRef.current!;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const videoStream = (canvas as any).captureStream 
      ? (isSafari ? (canvas as any).captureStream() : (canvas as any).captureStream(recordFps)) 
      : null;
    if (!videoStream) {
      alert('Canvas capture is not supported in this browser. Please try Chrome, Firefox, or Safari.');
      return;
    }

    const dest = ctx.createMediaStreamDestination();
    analyser.connect(dest);

    const combinedStream = new MediaStream();
    videoStream.getVideoTracks().forEach((track: any) => combinedStream.addTrack(track));
    dest.stream.getAudioTracks().forEach((track: any) => combinedStream.addTrack(track));

    const mimeTypes = isSafari
      ? [
          'video/mp4;codecs=avc1.4d401f,mp4a.40.2',
          'video/mp4;codecs=h264,aac',
          'video/mp4', // Safe default on Safari/Apple ecosystem
          'video/webm;codecs=vp9,opus',
          'video/webm'
        ]
      : [
          'video/mp4;codecs=h264,aac',
          'video/webm;codecs=vp9,opus',
          'video/webm;codecs=vp8,opus',
          'video/webm'
        ];

    let selectedMime = '';
    for (const mime of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mime)) {
        selectedMime = mime;
        break;
      }
    }

    // Higher Bitrate (12-24 Mbps) to support ultra sharp canvas frames (only on non-Safari browsers to prevent Apple hardware encoder issues)
    const options: any = {};
    if (!isSafari) {
      options.videoBitsPerSecond = resolutionMultiplier >= 2.2 ? 24000000 : 12000000;
    }
    if (selectedMime) {
      options.mimeType = selectedMime;
    }

    try {
      const recorder = new MediaRecorder(combinedStream, options);
      recordedChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const mimeType = selectedMime || 'video/webm';
        const blob = new Blob(recordedChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const extension = mimeType.includes('mp4') ? 'mp4' : 'webm';
        const filename = `private-techno-visuals-${Date.now()}.${extension}`;

        // Store download details in state & ref (to revoke later on next record)
        setDownloadInfo({ url, filename, extension });
        prevDownloadUrlRef.current = url;

        // Auto-download attempt (might be blocked by Safari, hence the new button)
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
          document.body.removeChild(a);
        }, 100);

        analyser.disconnect(dest);

        if (extension === 'webm') {
          setTimeout(() => {
            alert(
              'TRANSMISSION SAVED // Video exported as .webm (Chrome standard).\n\n' +
              'NOTE FOR iOS WORKFLOW:\n' +
              'If you want to edit this video in CapCut or play it on your iPhone, we highly recommend recording it using SAFARI to export directly as a 100% compatible .mp4 file. Alternatively, you can convert this .webm file to .mp4 online.'
            );
          }, 500);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start(100); 
      setIsRecording(true);
      setRecordTime(0);

      recordIntervalRef.current = setInterval(() => {
        setRecordTime((prev) => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('Recording starting error:', err);
      alert('Failed to initialize MediaRecorder: ' + err);
    }
  }, [resolutionMultiplier, recordFps]);

  const startRecordingRef = useRef(startRecording);
  useEffect(() => {
    startRecordingRef.current = startRecording;
  }, [startRecording]);

  // Initialize Web Audio context & nodes on first interactive action
  const initAudio = useCallback(() => {
    if (audioContextRef.current) {
      return {
        ctx: audioContextRef.current,
        analyser: analyserRef.current!
      };
    }

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.45; // Fast response for highly reactive techno beats

    audioContextRef.current = ctx;
    analyserRef.current = analyser;

    if (!audioElementRef.current) {
      const audio = new Audio();
      audio.crossOrigin = 'anonymous';
      audioElementRef.current = audio;

      audio.ontimeupdate = () => {
        const time = audio.currentTime;
        setCurrentTime(time);
        
        // Auto-stop recording if we reached/exceeded trimEnd
        if (time >= trimEndRef.current) {
          audio.pause();
          audio.currentTime = trimStartRef.current;
          setCurrentTime(trimStartRef.current);
          setIsPlaying(false);
          if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            stopRecordingRef.current();
          }
        }
      };
      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
        setTrimStart(0);
        setTrimEnd(audio.duration);
      };
      audio.onended = () => {
        setIsPlaying(false);
        // Automatically stop recording when audio ends if autoRecordMode is active
        if (autoRecordRef.current && mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          stopRecordingRef.current();
        }
      };

      const source = ctx.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      mediaSourceRef.current = source;
    }

    synthRef.current = new HypnoticSynth(ctx, analyser);
    setAudioInitialized(true);

    return { ctx, analyser };
  }, []);

  // Dispatch a simulated window resize event to redraw/center particles on aspect changes
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 120);
    return () => clearTimeout(timer);
  }, [aspectRatio, controlLayout]);

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      const audio = audioElementRef.current;
      if (audio) {
        audio.currentTime = trimStart;
        setCurrentTime(trimStart);
      }
      startRecording();
      if (audio && audio.src && !isPlaying && !synthActive) {
        audio.play().then(() => setIsPlaying(true));
      }
    }
  };

  // Scrub progress on local audio playback
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioElementRef.current;
    if (!audio || !duration || synthActive) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;

    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Seek/Reset audio track to the absolute beginning
  const handleRestartTrack = () => {
    const audio = audioElementRef.current;
    if (audio) {
      audio.currentTime = 0;
      setCurrentTime(0);
    }
  };

  // Adjust volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioElementRef.current) {
      audioElementRef.current.volume = val;
    }
  };

  // Toggle built-in warehouse techno sequencer
  const handleToggleSynth = async () => {
    const { ctx } = initAudio();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    if (synthActive) {
      synthRef.current?.stop();
      setSynthActive(false);
      setFileName('');
      if (autoRecordRef.current && mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        stopRecording();
      }
    } else {
      if (audioElementRef.current && !audioElementRef.current.paused) {
        audioElementRef.current.pause();
        setIsPlaying(false);
      }

      synthRef.current?.start();
      setSynthActive(true);
      setCustomTitle('');
      setFileName('INTERNAL SYNTH SIGNAL (LOOP - 135 BPM)');
      
      // Delay recording starting a tiny bit to let nodes connect
      if (autoRecordRef.current) {
        setTimeout(() => {
          if (autoRecordRef.current && !mediaRecorderRef.current) {
            startRecordingRef.current();
          }
        }, 100);
      }
    }
  };

  // Toggle play/pause on uploaded file
  const handlePlayPauseAudio = async () => {
    const { ctx } = initAudio();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const audio = audioElementRef.current;
    if (!audio || !audio.src) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      if (autoRecordRef.current && mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        stopRecording();
      }
    } else {
      if (synthActive) {
        synthRef.current?.stop();
        setSynthActive(false);
      }

      if (audio.currentTime < trimStart || audio.currentTime >= trimEnd) {
        audio.currentTime = trimStart;
        setCurrentTime(trimStart);
      }

      audio.play().then(() => {
        setIsPlaying(true);
        if (autoRecordRef.current && !mediaRecorderRef.current) {
          startRecordingRef.current();
        }
      }).catch((err) => {
        console.error('Playback trigger failure:', err);
      });
    }
  };

  // Handle file select
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { ctx } = initAudio();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    if (synthActive) {
      synthRef.current?.stop();
      setSynthActive(false);
    }

    const audio = audioElementRef.current;
    if (audio) {
      audio.pause();
      const objectURL = URL.createObjectURL(file);
      audio.src = objectURL;
      audio.load();
      setCustomTitle('');
      setFileName(file.name);

      audio.play().then(() => {
        setIsPlaying(true);
        if (autoRecordRef.current && !mediaRecorderRef.current) {
          startRecordingRef.current();
        }
      }).catch((err) => {
        console.error('Audio load autoplay failure:', err);
      });
    }
  };

  // Handle custom background image select
  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectURL = URL.createObjectURL(file);
    setBackgroundImage(objectURL);
  };

  const handleClearBg = () => {
    setBackgroundImage(null);
  };

  // Handle custom white-label logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectURL = URL.createObjectURL(file);
    setCustomLogo(objectURL);
  };

  const handleClearLogo = () => {
    setCustomLogo(null);
  };

  // Drag handles for the start / end brackets on the progress timeline
  const handleDragBracket = (type: 'start' | 'end', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const updateValue = (clientX: number) => {
      const container = progressBarRef.current;
      if (!container || !duration) return;

      const rect = container.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const val = percentage * duration;

      if (type === 'start') {
        setTrimStart(val);
        if (val > trimEnd) {
          setTrimEnd(val);
        }
        const audio = audioElementRef.current;
        if (audio) {
          audio.currentTime = val;
          setCurrentTime(val);
        }
      } else {
        setTrimEnd(Math.max(val, trimStart));
      }
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      updateValue(moveEvent.clientX);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchBracket = (type: 'start' | 'end', e: React.TouchEvent) => {
    e.stopPropagation();

    const updateValue = (clientX: number) => {
      const container = progressBarRef.current;
      if (!container || !duration) return;

      const rect = container.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const val = percentage * duration;

      if (type === 'start') {
        setTrimStart(val);
        if (val > trimEnd) {
          setTrimEnd(val);
        }
        const audio = audioElementRef.current;
        if (audio) {
          audio.currentTime = val;
          setCurrentTime(val);
        }
      } else {
        setTrimEnd(Math.max(val, trimStart));
      }
    };

    const handleTouchMove = (moveEvent: TouchEvent) => {
      if (moveEvent.touches[0]) {
        updateValue(moveEvent.touches[0].clientX);
      }
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);
  };

  // Dragging handlers for Floating Layout
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (controlLayout !== 'floating') return;
    if ((e.target as HTMLElement).closest('button, input, select, range')) return;

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: floatingPosition.x,
      posY: floatingPosition.y
    };

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
  };

  const handleDragMove = useCallback((e: MouseEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    
    // Bounds check
    const newX = Math.max(10, Math.min(window.innerWidth - 100, dragRef.current.posX + dx));
    const newY = Math.max(10, Math.min(window.innerHeight - 50, dragRef.current.posY + dy));
    
    setFloatingPosition({ x: newX, y: newY });
  }, []);

  const handleDragEnd = useCallback(() => {
    dragRef.current = null;
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
  }, [handleDragMove]);

  // Clean up all resources when component unmounts
  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.stop();
      }
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current.src = '';
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch((err) => {
          console.error('Error shutting down audio context:', err);
        });
      }
    };
  }, []);

  // Time formatter helpers
  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return '00:00';
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatRecordTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Reusable Layout selector component
  const renderLayoutSelector = (isMini: boolean = false) => {
    return (
      <div className={isMini ? styles.layoutSelectorMini : styles.layoutSelector}>
        <button
          className={`${styles.layoutBtn} ${controlLayout === 'bottom' ? styles.layoutBtnActive : ''}`}
          onClick={() => {
            setControlLayout('bottom');
            setIsMinimized(false);
          }}
          title="Dock controls below the viewport"
        >
          {isMini ? '⤓' : 'DOCK BOTTOM'}
        </button>
        <button
          className={`${styles.layoutBtn} ${controlLayout === 'left' ? styles.layoutBtnActive : ''}`}
          onClick={() => {
            setControlLayout('left');
            setIsMinimized(false);
          }}
          title="Dock controls to the left panel"
        >
          {isMini ? '⇠' : 'DOCK LEFT'}
        </button>
        <button
          className={`${styles.layoutBtn} ${controlLayout === 'floating' ? styles.layoutBtnActive : ''}`}
          onClick={() => {
            setControlLayout('floating');
            setIsMinimized(false);
          }}
          title="Make controls a floating draggable window"
        >
          {isMini ? '⎋' : 'FLOAT WINDOW'}
        </button>
      </div>
    );
  };

  // Title Text display selector
  const activeTitleText = customTitle.trim()
    ? customTitle.trim().toUpperCase()
    : ((synthActive || isPlaying) && fileName ? fileName.toUpperCase() : '');

  // Reusable Control Cards Component
  const renderControlCards = (gridClass: string) => {
    return (
      <div className={gridClass}>
        {/* Card 1: Media Setup */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>01 // MEDIA SOURCES</h3>
          
          <div className={styles.uploader} onClick={() => fileInputRef.current?.click()}>
            <span className={styles.uploadIcon}>📥</span>
            <p className={styles.uploadText}>LOAD LOCAL TRACK</p>
            <p className={styles.uploadSub}>DRAG/CLICK (.MP3, .WAV, .M4A)</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </div>

          <button 
            className={`${styles.synthButton} ${synthActive ? styles.synthButtonActive : ''}`}
            onClick={handleToggleSynth}
          >
            {synthActive ? 'STOP SYNTH SIGNAL' : 'SYNTHESIZE HYPNOTIC BEAT'}
          </button>

          {fileName && (
            <div className={styles.fileInfo}>
              <span className={styles.fileName}>{fileName}</span>
              <span>STATUS: {synthActive ? 'SEQUENCING' : isPlaying ? 'PLAYING' : 'PAUSED'}</span>
            </div>
          )}

          {/* Playback & Volume */}
          {!synthActive && fileName && (
            <div className={styles.playbackControls}>
              <button 
                className={styles.playPauseBtn} 
                onClick={handleRestartTrack}
                title="Restart Track (Rewind)"
                style={{ marginRight: '6px' }}
              >
                ⏪
              </button>
              
              <button className={styles.playPauseBtn} onClick={handlePlayPauseAudio}>
                {isPlaying ? (
                  <svg className={styles.pauseIcon} viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg className={styles.playIcon} viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              <div className={styles.volumeContainer}>
                <span className={styles.volumeLabel}>VOL</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className={styles.slider}
                />
              </div>
            </div>
          )}

          {/* Track Progress / Trim Bar */}
          {!synthActive && fileName && duration > 0 && (
            <div className={styles.progressContainer}>
              <span className={styles.statesLabel}>
                TRACK TIMELINE // CLIP DURATION: {formatTime(trimEnd - trimStart)}
              </span>
              <div 
                ref={progressBarRef}
                className={`${styles.progressBar} ${styles.progressBarTrimmed}`} 
                onClick={handleProgressBarClick}
              >
                {/* Selected trim range backdrop */}
                <div 
                  className={styles.trimRangeFill} 
                  style={{ 
                    left: `${(trimStart / duration) * 100}%`, 
                    width: `${((trimEnd - trimStart) / duration) * 100}%` 
                  }} 
                />
                
                {/* Playhead */}
                <div 
                  className={styles.playhead} 
                  style={{ left: `${(currentTime / duration) * 100}%` }} 
                />

                {/* Start bracket */}
                <div 
                  className={styles.bracketLeft} 
                  onMouseDown={(e) => handleDragBracket('start', e)} 
                  onTouchStart={(e) => handleTouchBracket('start', e)} 
                  style={{ left: `${(trimStart / duration) * 100}%` }}
                >
                  [
                </div>

                {/* End bracket */}
                <div 
                  className={styles.bracketRight} 
                  onMouseDown={(e) => handleDragBracket('end', e)} 
                  onTouchStart={(e) => handleTouchBracket('end', e)} 
                  style={{ left: `${(trimEnd / duration) * 100}%` }}
                >
                  ]
                </div>
              </div>
              <div className={styles.timeRow}>
                <span>START: {formatTime(trimStart)}</span>
                <span style={{ color: 'var(--orange)', fontWeight: 'bold' }}>PLAYHEAD: {formatTime(currentTime)}</span>
                <span>END: {formatTime(trimEnd)}</span>
              </div>
            </div>
          )}

          {/* Background Image customizer */}
          <div className={styles.studioContainer} style={{ borderTop: '1px dashed rgba(255, 255, 255, 0.1)', paddingTop: '20px', marginTop: '15px' }}>
            <span className={styles.statesLabel}>MONITOR BACKGROUND IMAGE</span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className={styles.synthButton} 
                onClick={() => bgFileInputRef.current?.click()}
                style={{ flex: 1 }}
              >
                LOAD BG IMAGE
              </button>
              {backgroundImage && (
                <button 
                  className={styles.synthButton} 
                  onClick={handleClearBg}
                  style={{ borderColor: '#ff3333', color: '#ff3333' }}
                >
                  CLEAR
                </button>
              )}
            </div>
            <input
              ref={bgFileInputRef}
              type="file"
              accept="image/*"
              onChange={handleBgUpload}
              style={{ display: 'none' }}
            />
            
            {backgroundImage && (
              <div className={styles.controlRow} style={{ marginTop: '5px' }}>
                <div className={styles.controlLabelRow}>
                  <span className={styles.controlName}>BG OPACITY</span>
                  <span className={styles.controlValue}>{(bgOpacity * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="1.0"
                  step="0.05"
                  value={bgOpacity}
                  onChange={(e) => setBgOpacity(parseFloat(e.target.value))}
                  className={styles.slider}
                />
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Reaction Engines & Shape Lock Grid */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>02 // REACTION & RECORDING</h3>
          
          <div className={styles.buttonGroup}>
            <button 
              className={`${styles.modeBtn} ${reactionMode === 'deform' ? styles.modeBtnActive : ''}`}
              onClick={() => setReactionMode('deform')}
            >
              DEFORM RIPPLES
            </button>
            <button 
              className={`${styles.modeBtn} ${reactionMode === 'pulse' ? styles.modeBtnActive : ''}`}
              onClick={() => setReactionMode('pulse')}
            >
              KICK PULSE
            </button>
            <button 
              className={`${styles.modeBtn} ${reactionMode === 'orbit' ? styles.modeBtnActive : ''}`}
              onClick={() => setReactionMode('orbit')}
            >
              SPATIAL SWIRL
            </button>
            <button 
              className={`${styles.modeBtn} ${reactionMode === 'explode' ? styles.modeBtnActive : ''}`}
              onClick={() => setReactionMode('explode')}
            >
              BASS BLAST
            </button>
          </div>

          {/* Color Palettes */}
          <div className={styles.statesGroup} style={{ marginTop: '16px', marginBottom: '8px' }}>
            <span className={styles.statesLabel}>COLOR PALETTE PRESET</span>
            <div className={styles.aspectSelector} style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              <button
                className={`${styles.aspectBtn} ${colorPalette === 'orange' ? styles.aspectBtnActive : ''}`}
                onClick={() => setColorPalette('orange')}
                style={colorPalette === 'orange' ? { borderColor: '#e8550f', color: '#e8550f', boxShadow: '0 0 10px rgba(232,85,15,0.15)' } : {}}
              >
                ORANGE
              </button>
              <button
                className={`${styles.aspectBtn} ${colorPalette === 'acid' ? styles.aspectBtnActive : ''}`}
                onClick={() => setColorPalette('acid')}
                style={colorPalette === 'acid' ? { borderColor: '#39ff14', color: '#39ff14', boxShadow: '0 0 10px rgba(57,255,20,0.15)' } : {}}
              >
                ACID GREEN
              </button>
              <button
                className={`${styles.aspectBtn} ${colorPalette === 'cyan' ? styles.aspectBtnActive : ''}`}
                onClick={() => setColorPalette('cyan')}
                style={colorPalette === 'cyan' ? { borderColor: '#00f0ff', color: '#00f0ff', boxShadow: '0 0 10px rgba(0,240,255,0.15)' } : {}}
              >
                CYAN BLUE
              </button>
              <button
                className={`${styles.aspectBtn} ${colorPalette === 'crimson' ? styles.aspectBtnActive : ''}`}
                onClick={() => setColorPalette('crimson')}
                style={colorPalette === 'crimson' ? { borderColor: '#ff0a28', color: '#ff0a28', boxShadow: '0 0 10px rgba(255,10,40,0.15)' } : {}}
              >
                CRIMSON RED
              </button>
              <button
                className={`${styles.aspectBtn} ${colorPalette === 'amber' ? styles.aspectBtnActive : ''}`}
                onClick={() => setColorPalette('amber')}
                style={colorPalette === 'amber' ? { borderColor: '#ffb000', color: '#ffb000', boxShadow: '0 0 10px rgba(255,176,0,0.15)' } : {}}
              >
                AMBER GOLD
              </button>
              <button
                className={`${styles.aspectBtn} ${colorPalette === 'monochrome' ? styles.aspectBtnActive : ''}`}
                onClick={() => setColorPalette('monochrome')}
                style={colorPalette === 'monochrome' ? { borderColor: '#ffffff', color: '#ffffff', boxShadow: '0 0 10px rgba(255,255,255,0.15)' } : {}}
              >
                BERLIN MONO
              </button>
            </div>
          </div>

          <div className={styles.statesGroup}>
            <span className={styles.statesLabel}>
              {lockedState !== null 
                ? `GEOMETRY LOCK: ${MORPH_STATES[lockedState].name.toUpperCase()}`
                : 'GEOMETRY CYCLE: TIMELINE ROTATING'
              }
            </span>
            <div className={styles.statesGrid}>
              {MORPH_STATES.map((state) => (
                <button
                  key={state.id}
                  className={`${styles.stateBtn} ${lockedState === state.id ? styles.stateBtnActive : ''}`}
                  onClick={() => setLockedState(state.id)}
                  title={state.name}
                >
                  {state.id.toString().padStart(2, '0')}
                </button>
              ))}
              <button
                className={`${styles.stateBtn} ${styles.cycleBtn} ${lockedState === null ? styles.stateBtnActive : ''}`}
                onClick={() => setLockedState(null)}
              >
                RELEASE (CYCLE TIMELINE)
              </button>
            </div>
          </div>

          {/* Studio Monitor Dimensions & Recorder */}
          <div className={styles.studioContainer}>
            <span className={styles.statesLabel}>STUDIO ASPECT MONITOR</span>
            <div className={styles.aspectSelector}>
              <button
                className={`${styles.aspectBtn} ${aspectRatio === 'full' ? styles.aspectBtnActive : ''}`}
                onClick={() => setAspectRatio('full')}
              >
                FULL
              </button>
              <button
                className={`${styles.aspectBtn} ${aspectRatio === 'ratio169' ? styles.aspectBtnActive : ''}`}
                onClick={() => setAspectRatio('ratio169')}
              >
                16:9
              </button>
              <button
                className={`${styles.aspectBtn} ${aspectRatio === 'ratio916' ? styles.aspectBtnActive : ''}`}
                onClick={() => setAspectRatio('ratio916')}
              >
                9:16
              </button>
              <button
                className={`${styles.aspectBtn} ${aspectRatio === 'ratio11' ? styles.aspectBtnActive : ''}`}
                onClick={() => setAspectRatio('ratio11')}
              >
                1:1
              </button>
            </div>

            {/* Quality scale selector */}
            <span className={styles.statesLabel} style={{ marginTop: '5px' }}>RECORDING RENDER RESOLUTION</span>
            <div className={styles.aspectSelector}>
              <button
                className={`${styles.aspectBtn} ${resolutionMultiplier === 1.0 ? styles.aspectBtnActive : ''}`}
                onClick={() => setResolutionMultiplier(1.0)}
                title="Standard Definition (Fastest)"
              >
                SD (1.0x)
              </button>
              <button
                className={`${styles.aspectBtn} ${resolutionMultiplier === 1.5 ? styles.aspectBtnActive : ''}`}
                onClick={() => setResolutionMultiplier(1.5)}
                title="High Definition (Balanced)"
              >
                HD (1.5x)
              </button>
              <button
                className={`${styles.aspectBtn} ${resolutionMultiplier === 2.2 ? styles.aspectBtnActive : ''}`}
                onClick={() => setResolutionMultiplier(2.2)}
                title="Full HD (Sharp Export)"
              >
                FHD (2.2x)
              </button>
              <button
                className={`${styles.aspectBtn} ${resolutionMultiplier === 3.0 ? styles.aspectBtnActive : ''}`}
                onClick={() => setResolutionMultiplier(3.0)}
                title="Ultra HD (Maximum Crispness)"
              >
                4K (3.0x)
              </button>
            </div>

            {/* FPS Selector */}
            <span className={styles.statesLabel} style={{ marginTop: '5px' }}>RECORDING FRAME RATE</span>
            <div className={styles.aspectSelector} style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <button
                className={`${styles.aspectBtn} ${recordFps === 30 ? styles.aspectBtnActive : ''}`}
                onClick={() => setRecordFps(30)}
                title="Standard 30 Frames Per Second"
              >
                30 FPS
              </button>
              <button
                className={`${styles.aspectBtn} ${recordFps === 60 ? styles.aspectBtnActive : ''}`}
                onClick={() => setRecordFps(60)}
                title="Ultra-Smooth 60 Frames Per Second"
              >
                60 FPS
              </button>
            </div>

            {/* Cinematic Camera Toggle */}
            <div 
              className={styles.toggleContainer} 
              onClick={() => setCameraEffects(!cameraEffects)}
              style={{ marginTop: '10px', padding: '10px 0', borderTop: '1px dashed rgba(255,255,255,0.06)' }}
            >
              <span className={styles.toggleLabel}>CINEMATIC 3D CAMERA</span>
              <div className={`${styles.toggleSwitch} ${cameraEffects ? styles.toggleSwitchActive : ''}`} />
            </div>

            {/* Automatic recording toggle switch */}
            <div 
              className={styles.toggleContainer} 
              onClick={() => setAutoRecordMode(!autoRecordMode)}
              style={{ padding: '10px 0', borderTop: '1px dashed rgba(255,255,255,0.06)' }}
            >
              <span className={styles.toggleLabel}>AUTO-RECORD ON PLAYBACK</span>
              <div className={`${styles.toggleSwitch} ${autoRecordMode ? styles.toggleSwitchActive : ''}`} />
            </div>

            <button 
              className={`${styles.recordBtn} ${isRecording ? styles.recordBtnActive : ''}`}
              onClick={handleToggleRecording}
              disabled={autoRecordMode}
              style={autoRecordMode ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
              title={autoRecordMode ? "Manual recording is disabled while Auto-Record is active" : ""}
            >
              {isRecording ? `🔴 STOP RECORDING [${formatRecordTime(recordTime)}]` : '⏺ RECORD STUDIO SIGNAL'}
            </button>

            {downloadInfo && (
              <a 
                href={downloadInfo.url} 
                download={downloadInfo.filename}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  marginTop: '15px',
                  background: 'rgba(255, 94, 51, 0.15)',
                  border: '1px solid #ff5e33',
                  color: '#ff5e33',
                  padding: '16px',
                  fontFamily: 'var(--font-orbitron, Orbitron, sans-serif)',
                  fontSize: '0.85rem',
                  letterSpacing: '0.15em',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  boxShadow: '0 0 20px rgba(255, 94, 51, 0.3)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
                className={styles.downloadReadyBtn}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#ff5e33';
                  e.currentTarget.style.color = '#000';
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 94, 51, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 94, 51, 0.15)';
                  e.currentTarget.style.color = '#ff5e33';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 94, 51, 0.3)';
                }}
              >
                <span>📥 DOWNLOAD READY ({downloadInfo.extension.toUpperCase()})</span>
              </a>
            )}
          </div>
        </div>

        {/* Card 3: Calibration Sliders & Text Settings */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>03 // CALIBRATION</h3>

          <div className={styles.controlRow}>
            <div className={styles.controlLabelRow}>
              <span className={styles.controlName}>GLOBAL SENSITIVITY</span>
              <span className={styles.controlValue}>{sensitivity.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="2.5"
              step="0.05"
              value={sensitivity}
              onChange={(e) => setSensitivity(parseFloat(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.controlRow}>
            <div className={styles.controlLabelRow}>
              <span className={styles.controlName}>BASS RESPONSE</span>
              <span className={styles.controlValue}>{bassMultiplier.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0"
              max="3.0"
              step="0.1"
              value={bassMultiplier}
              onChange={(e) => setBassMultiplier(parseFloat(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.controlRow}>
            <div className={styles.controlLabelRow}>
              <span className={styles.controlName}>MIDS RESONANCE</span>
              <span className={styles.controlValue}>{midMultiplier.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0"
              max="3.0"
              step="0.1"
              value={midMultiplier}
              onChange={(e) => setMidMultiplier(parseFloat(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.controlRow}>
            <div className={styles.controlLabelRow}>
              <span className={styles.controlName}>TREBLE CLARITY</span>
              <span className={styles.controlValue}>{trebleMultiplier.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0"
              max="3.0"
              step="0.1"
              value={trebleMultiplier}
              onChange={(e) => setTrebleMultiplier(parseFloat(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.controlRow}>
            <div className={styles.controlLabelRow}>
              <span className={styles.controlName}>ROTATION SPINTIME</span>
              <span className={styles.controlValue}>{rotationMultiplier.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0"
              max="3.0"
              step="0.1"
              value={rotationMultiplier}
              onChange={(e) => setRotationMultiplier(parseFloat(e.target.value))}
              className={styles.slider}
            />
          </div>
          <div className={styles.controlRow}>
            <div className={styles.controlLabelRow}>
              <span className={styles.controlName}>AUTO-CYCLE SPEED (TIEMPO DE CICLO)</span>
              <span className={styles.controlValue}>{(autoCycleDuration / 24).toFixed(1)}s/shape</span>
            </div>
            <input
              type="range"
              min="24"
              max="240"
              step="12"
              value={autoCycleDuration}
              onChange={(e) => setAutoCycleDuration(parseInt(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.controlRow}>
            <div className={styles.controlLabelRow}>
              <span className={styles.controlName}>PARTICLE SIZE (TAMAÑO)</span>
              <span className={styles.controlValue}>{particleSizeMultiplier.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="3.5"
              step="0.1"
              value={particleSizeMultiplier}
              onChange={(e) => setParticleSizeMultiplier(parseFloat(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div 
            className={styles.toggleContainer} 
            onClick={() => setReactiveColor(!reactiveColor)}
          >
            <span className={styles.toggleLabel}>FLASH COLOR ON TREBLE KICKS</span>
            <div className={`${styles.toggleSwitch} ${reactiveColor ? styles.toggleSwitchActive : ''}`} />
          </div>

          {/* Title Text & Positioning */}
          <div className={styles.studioContainer} style={{ borderTop: '1px dashed rgba(255, 255, 255, 0.1)', paddingTop: '20px', marginTop: '15px' }}>
            <span className={styles.statesLabel}>TITLE & LOGO OVERLAYS</span>

            <div 
              className={styles.toggleContainer} 
              onClick={() => setShowLogo(!showLogo)}
              style={{ marginTop: '10px' }}
            >
              <span className={styles.toggleLabel}>SHOW BRAND LOGO OVERLAY</span>
              <div className={`${styles.toggleSwitch} ${showLogo ? styles.toggleSwitchActive : ''}`} />
            </div>

            <div 
              className={styles.toggleContainer} 
              onClick={() => setShowTitleText(!showTitleText)}
              style={{ marginBottom: '15px' }}
            >
              <span className={styles.toggleLabel}>SHOW TITLE / TRACK TEXT</span>
              <div className={`${styles.toggleSwitch} ${showTitleText ? styles.toggleSwitchActive : ''}`} />
            </div>

            {/* Custom Logo Upload */}
            <div className={styles.studioContainer} style={{ borderTop: '1px dashed rgba(255, 255, 255, 0.1)', paddingTop: '12px', marginTop: '10px', marginBottom: '12px' }}>
              <span className={styles.statesLabel}>WHITE-LABEL CUSTOM LOGO (PNG/SVG)</span>
              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button 
                  className={styles.synthButton} 
                  onClick={() => logoFileInputRef.current?.click()}
                  style={{ flex: 1, margin: 0 }}
                >
                  {customLogo ? 'LOGO LOADED ✓' : 'LOAD CUSTOM LOGO'}
                </button>
                {customLogo && (
                  <button 
                    className={styles.synthButton} 
                    onClick={handleClearLogo}
                    style={{ borderColor: '#ff3333', color: '#ff3333', margin: 0 }}
                  >
                    RESET
                  </button>
                )}
              </div>
              <input
                ref={logoFileInputRef}
                type="file"
                accept="image/png, image/svg+xml, image/jpeg"
                onChange={handleLogoUpload}
                style={{ display: 'none' }}
              />
            </div>
            
            <div className={styles.controlRow}>
              <span className={styles.controlName}>CUSTOM TEXT OVERLAY</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="TYPE CUSTOM TEXT HERE..."
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'var(--white)',
                    padding: '10px 14px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    outline: 'none',
                    borderRadius: '2px',
                    flex: 1,
                  }}
                />
                {customTitle && (
                  <button
                    className={styles.synthButton}
                    onClick={() => setCustomTitle('')}
                    style={{ width: 'auto', padding: '0 12px', fontSize: '8px', margin: 0, borderColor: '#ff3333', color: '#ff3333' }}
                  >
                    CLEAR
                  </button>
                )}
              </div>
            </div>

            <div className={styles.controlRow}>
              <div className={styles.controlLabelRow}>
                <span className={styles.controlName}>TEXT HEIGHT (Y SHIFT)</span>
                <span className={styles.controlValue}>{titleYOffset}px</span>
              </div>
              <input
                type="range"
                min="-250"
                max="250"
                step="2"
                value={titleYOffset}
                onChange={(e) => setTitleYOffset(parseInt(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.controlRow}>
              <div className={styles.controlLabelRow}>
                <span className={styles.controlName}>TEXT SCALE (SIZE)</span>
                <span className={styles.controlValue}>{titleScale.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.4"
                max="2.0"
                step="0.05"
                value={titleScale}
                onChange={(e) => setTitleScale(parseFloat(e.target.value))}
                className={styles.slider}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- RENDERING OF SETUP PANEL WIZARD (Define canvas before starting) ---
  if (!studioInitialized) {
    return (
      <main className={styles.container} id="visual-creator">
        <CustomCursor targetId="visual-creator" />
        <section className={styles.heroSection} style={{ justifyContent: 'center', alignItems: 'center' }}>
          <DiagramLines />
          <div className={styles.card} style={{ maxWidth: '480px', zIndex: 10, padding: '30px', border: '1px solid var(--orange)', background: '#080808' }}>
            <h2 className={styles.cardTitle} style={{ fontSize: '14px', marginBottom: '20px', letterSpacing: '0.15em', textAlign: 'center', color: 'var(--orange)' }}>
              ⚡ [ SYS.002 // VISUAL STUDIO SETUP ]
            </h2>

            {/* Select Aspect Ratio */}
            <div className={styles.studioContainer} style={{ border: 'none', paddingTop: 0 }}>
              <span className={styles.statesLabel}>SELECT STUDIO RATIO</span>
              <div className={styles.aspectSelector}>
                <button
                  className={`${styles.aspectBtn} ${aspectRatio === 'full' ? styles.aspectBtnActive : ''}`}
                  onClick={() => setAspectRatio('full')}
                >
                  FULL
                </button>
                <button
                  className={`${styles.aspectBtn} ${aspectRatio === 'ratio169' ? styles.aspectBtnActive : ''}`}
                  onClick={() => setAspectRatio('ratio169')}
                >
                  16:9
                </button>
                <button
                  className={`${styles.aspectBtn} ${aspectRatio === 'ratio916' ? styles.aspectBtnActive : ''}`}
                  onClick={() => setAspectRatio('ratio916')}
                >
                  9:16
                </button>
                <button
                  className={`${styles.aspectBtn} ${aspectRatio === 'ratio11' ? styles.aspectBtnActive : ''}`}
                  onClick={() => setAspectRatio('ratio11')}
                >
                  1:1
                </button>
              </div>
            </div>

            {/* Select Quality Render */}
            <div className={styles.studioContainer} style={{ marginTop: '10px' }}>
              <span className={styles.statesLabel}>EXPORT RENDER QUALITY</span>
              <div className={styles.aspectSelector}>
                <button
                  className={`${styles.aspectBtn} ${resolutionMultiplier === 1.0 ? styles.aspectBtnActive : ''}`}
                  onClick={() => setResolutionMultiplier(1.0)}
                >
                  SD (1.0x)
                </button>
                <button
                  className={`${styles.aspectBtn} ${resolutionMultiplier === 1.5 ? styles.aspectBtnActive : ''}`}
                  onClick={() => setResolutionMultiplier(1.5)}
                >
                  HD (1.5x)
                </button>
                <button
                  className={`${styles.aspectBtn} ${resolutionMultiplier === 2.2 ? styles.aspectBtnActive : ''}`}
                  onClick={() => setResolutionMultiplier(2.2)}
                >
                  FHD (2.2x)
                </button>
                <button
                  className={`${styles.aspectBtn} ${resolutionMultiplier === 3.0 ? styles.aspectBtnActive : ''}`}
                  onClick={() => setResolutionMultiplier(3.0)}
                >
                  4K (3.0x)
                </button>
              </div>
            </div>

            {/* Select Frame Rate */}
            <div className={styles.studioContainer} style={{ marginTop: '10px' }}>
              <span className={styles.statesLabel}>EXPORT FRAME RATE</span>
              <div className={styles.aspectSelector} style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                <button
                  className={`${styles.aspectBtn} ${recordFps === 30 ? styles.aspectBtnActive : ''}`}
                  onClick={() => setRecordFps(30)}
                >
                  30 FPS
                </button>
                <button
                  className={`${styles.aspectBtn} ${recordFps === 60 ? styles.aspectBtnActive : ''}`}
                  onClick={() => setRecordFps(60)}
                >
                  60 FPS
                </button>
              </div>
            </div>

            {/* Track name setup */}
            <div className={styles.studioContainer} style={{ marginTop: '10px' }}>
              <span className={styles.statesLabel}>CUSTOM TRACK TITLE (OPTIONAL)</span>
              <input
                type="text"
                placeholder="TYPE CUSTOM TEXT HERE..."
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--white)',
                  padding: '10px 14px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  outline: 'none',
                  borderRadius: '2px',
                  width: '100%',
                }}
              />
            </div>

            {/* BG image setup */}
            <div className={styles.studioContainer} style={{ marginTop: '10px' }}>
              <span className={styles.statesLabel}>BACKGROUND MONITOR IMAGE (OPTIONAL)</span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className={styles.synthButton} 
                  onClick={() => bgFileInputRef.current?.click()}
                  style={{ flex: 1, margin: 0 }}
                >
                  {backgroundImage ? 'IMAGE LOADED ✓' : 'LOAD BACKGROUND IMAGE'}
                </button>
                {backgroundImage && (
                  <button 
                    className={styles.synthButton} 
                    onClick={handleClearBg}
                    style={{ borderColor: '#ff3333', color: '#ff3333', margin: 0 }}
                  >
                    CLEAR
                  </button>
                )}
              </div>
              <input
                ref={bgFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleBgUpload}
                style={{ display: 'none' }}
              />
            </div>

            {/* Custom Logo Upload in Setup */}
            <div className={styles.studioContainer} style={{ marginTop: '10px' }}>
              <span className={styles.statesLabel}>WHITE-LABEL CUSTOM LOGO (OPTIONAL)</span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className={styles.synthButton} 
                  onClick={() => logoSetupInputRef.current?.click()}
                  style={{ flex: 1, margin: 0 }}
                >
                  {customLogo ? 'LOGO LOADED ✓' : 'LOAD CUSTOM LOGO'}
                </button>
                {customLogo && (
                  <button 
                    className={styles.synthButton} 
                    onClick={handleClearLogo}
                    style={{ borderColor: '#ff3333', color: '#ff3333', margin: 0 }}
                  >
                    CLEAR
                  </button>
                )}
              </div>
              <input
                ref={logoSetupInputRef}
                type="file"
                accept="image/png, image/svg+xml, image/jpeg"
                onChange={handleLogoUpload}
                style={{ display: 'none' }}
              />
            </div>

            <button
              className={styles.recordBtn}
              style={{ borderColor: 'var(--orange)', color: 'var(--orange)', marginTop: '25px', width: '100%' }}
              onClick={() => {
                setStudioInitialized(true);
                // Dispatch layout recalculation
                setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
              }}
            >
              INITIALIZE WORKSPACE & ENTER STUDIO
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.container} id="visual-creator">
      <CustomCursor targetId="visual-creator" />

      {/* ── Viewport Visualizer (Landing Page Hero Clone) ── */}
      <section className={styles.heroSection}>
        <header className={`${styles.topBar} ${controlLayout === 'left' ? styles.monitorAreaDocked : ''}`}>
          <Link href="/" className={styles.backLink}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Terminal
          </Link>

          {/* Quick Layout Toggles on the Canvas HUD header */}
          {renderLayoutSelector(true)}
          
          <div className={styles.hudGroup}>
            <div className={styles.activeIndicator}>
              <span className={styles.activeDot} />
              <span>SYS.002 // AUDIO_VISUAL_MODULE</span>
            </div>
            <span className={styles.hudLabel}>
              {audioInitialized ? `SIGNAL_IN: ACTIVE // ${analyserRef.current?.fftSize || 512} FFT` : 'SIGNAL_IN: IDLE'}
            </span>
          </div>
        </header>

        {/* Outer Background Shapes (visible when aspect ratio is full) */}
        {aspectRatio === 'full' && (
          <>
            <DiagramLines />
            <div className={styles.decorationContainer}>
              <FuturisticShape name="shape1" className={styles.shapeHero1} width={200} height={200} />
              <FuturisticShape name="shape4" className={styles.shapeHero3} width={300} height={80} />
              <FuturisticShape name="shape3" className={styles.shapeHero2} width={180} height={180} />
              <FuturisticShape name="shape5" className={styles.shapeHero4} width={120} height={120} />
              <FuturisticShape name="shape6" className={styles.shapeHero5} width={150} height={150} />
              <FuturisticShape name="shape8" className={styles.shapeHero6} width={80} height={80} />
              <FuturisticShape name="shape7" className={styles.shapeHero7} width={100} height={100} />
              <FuturisticShape name="shape9" className={styles.shapeHero8} width={140} height={140} />
              <FuturisticShape name="shapes2" className={styles.shapeHero9} width={110} height={110} />
            </div>
          </>
        )}

        {/* Centered Monitor Area */}
        <div className={`${styles.monitorArea} ${controlLayout === 'left' ? styles.monitorAreaDocked : ''}`}>
          {/* Studio Screen monitor and Aspect Ratio containments */}
          <div className={`${styles.screenContainer} ${styles[aspectRatio]}`}>
            <div className={styles.canvasWrapper}>
              <AudioReactiveSphere
                analyserRef={analyserRef}
                canvasRef={canvasRef}
                resolutionMultiplier={resolutionMultiplier}
                backgroundImage={backgroundImage}
                bgOpacity={bgOpacity}
                activeTitleText={activeTitleText}
                titleYOffset={titleYOffset}
                titleScale={titleScale}
                showLogo={showLogo}
                showTitleText={showTitleText}
                showHudGrid={showHudGrid}
                sensitivity={sensitivity}
                bassMultiplier={bassMultiplier}
                midMultiplier={midMultiplier}
                trebleMultiplier={trebleMultiplier}
                rotationMultiplier={rotationMultiplier}
                  particleSizeMultiplier={particleSizeMultiplier}
                reactiveColor={reactiveColor}
                reactionMode={reactionMode}
                lockedState={lockedState}
                colorPalette={colorPalette}
                cameraEffects={cameraEffects}
                customLogo={customLogo}
                autoCycleDuration={autoCycleDuration}
              />
            </div>

            {/* View finder corner labels and overlays */}
            {aspectRatio !== 'full' && (
              <div className={styles.screenFrame}>
                <div className={styles.frameLabel}>
                  {aspectRatio === 'ratio169' ? 'REC_MON // 16:9 LANDSCAPE' : aspectRatio === 'ratio916' ? 'REC_MON // 9:16 VERTICAL' : 'REC_MON // 1:1 SQUARE'}
                </div>
                <div className={styles.frameResolution}>
                  {aspectRatio === 'ratio169' ? `1920 x 1080 [${recordFps}FPS]` : aspectRatio === 'ratio916' ? `1080 x 1920 [${recordFps}FPS]` : `1080 x 1080 [${recordFps}FPS]`}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Visualizer Status & REC Indicator overlay */}
        <div className={`${styles.visualizerOverlay} ${controlLayout === 'left' ? styles.visualizerOverlayDocked : ''}`}>
          {isRecording && (
            <div className={styles.recBadge} style={{ marginBottom: '8px', display: 'block' }}>
              🔴 REC [{formatRecordTime(recordTime)}]
            </div>
          )}
          <p className={styles.statusText}>
            {fileName 
              ? `PLAYING: ${fileName.toUpperCase()}`
              : 'STATUS: WAITING FOR AUDIO SOURCE SIGNAL...'
            }
          </p>
        </div>

        {/* Geometric corners */}
        <div className={styles.geoCorner + ' ' + styles.geoTL} />
        <div className={styles.geoCorner + ' ' + styles.geoTR} />
        <div className={styles.geoCorner + ' ' + styles.geoBL} />
        <div className={styles.geoCorner + ' ' + styles.geoBR} />

        {/* Scroll indicator - only show when controls are below viewport */}
        {controlLayout === 'bottom' && (
          <div className={styles.scrollIndicator}>
            <span className="ui-label">SCROLL TO CALIBRATE</span>
            <div className={styles.scrollLine} />
          </div>
        )}
      </section>

      {/* ── Render controls based on Layout Selection ── */}
      {controlLayout === 'bottom' ? (
        <section className={styles.controlsSection} id="controls">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>[ DEC.01 // SYSTEM CONTROLS ]</h2>
            {renderLayoutSelector()}
          </div>
          {renderControlCards(styles.grid)}
        </section>
      ) : controlLayout === 'left' ? (
        <aside className={styles.sidebarDock}>
          <div className={styles.sidebarHeader}>
            <span className={styles.sidebarTitle}>[ SYSTEM CONTROLS ]</span>
            {renderLayoutSelector(true)}
          </div>
          {renderControlCards(styles.gridLeft)}
        </aside>
      ) : (
        /* Floating Draggable Window */
        <div 
          className={`${styles.floatingWindow} ${isMinimized ? styles.floatingMinimized : ''}`}
          style={{ left: `${floatingPosition.x}px`, top: `${floatingPosition.y}px` }}
        >
          <div className={styles.floatingHeader} onMouseDown={handleDragStart}>
            <span className={styles.floatingTitle}>
              {isMinimized ? '⚡ [ CONTROLS ]' : '⚡ [ DRAG TO POSITION ]'}
            </span>
            <div className={styles.floatingWindowActions}>
              <button 
                onClick={() => setIsMinimized(!isMinimized)} 
                className={styles.minimizeBtn}
                title={isMinimized ? 'Expand Window' : 'Minimize Window'}
              >
                {isMinimized ? '▢' : '─'}
              </button>
              {renderLayoutSelector(true)}
            </div>
          </div>
          {!isMinimized && renderControlCards(styles.gridFloating)}
        </div>
      )}
    </main>
  );
}
