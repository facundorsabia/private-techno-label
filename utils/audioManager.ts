class AudioManager {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private source: MediaElementAudioSourceNode | null = null;
  private dataArray: Uint8Array | null = null;

  public isPlaying = false;
  private onStateChange: ((isPlaying: boolean) => void) | null = null;

  init(url: string) {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);
    }

    if (!this.audioElement) {
      this.audioElement = new Audio();
      this.audioElement.crossOrigin = 'anonymous';
      
      this.source = this.audioContext.createMediaElementSource(this.audioElement);
      this.source.connect(this.analyser!);
      this.analyser!.connect(this.audioContext.destination);

      this.audioElement.onended = () => {
        this.isPlaying = false;
        if (this.onStateChange) this.onStateChange(false);
      };
      
      this.audioElement.onplay = () => {
        this.isPlaying = true;
        if (this.onStateChange) this.onStateChange(true);
      };

      this.audioElement.onpause = () => {
        this.isPlaying = false;
        if (this.onStateChange) this.onStateChange(false);
      };
    }

    if (this.audioElement.src !== url) {
      this.audioElement.src = url;
    }
  }

  togglePlay(url: string) {
    if (!this.audioContext) {
      this.init(url);
    } else if (this.audioElement && this.audioElement.src && !this.audioElement.src.includes(url)) {
      // If it's a different track, change it
      this.audioElement.src = url;
    }
    
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume();
    }

    if (this.audioElement) {
      if (this.isPlaying) {
        this.audioElement.pause();
      } else {
        this.audioElement.play().catch(e => console.error("Audio playback error:", e));
      }
    }
  }

  stop() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
  }

  subscribe(callback: (isPlaying: boolean) => void) {
    this.onStateChange = callback;
  }

  // Returns normalized values between 0 and 1
  getReactivity() {
    if (!this.isPlaying || !this.analyser || !this.dataArray) {
      return { bass: 0, mid: 0, high: 0 };
    }

    // @ts-ignore - Bypass TS mismatch between Uint8Array<ArrayBufferLike> and DOM lib Uint8Array
    this.analyser.getByteFrequencyData(this.dataArray as any);

    // Calculate averages for bass, mid, and high frequencies
    // Assuming fftSize of 256 -> 128 bins. 
    // Approx mapping (44100Hz / 256 = ~172Hz per bin)
    // Bass: bins 0 to 5 (0 to ~860Hz)
    // Mid: bins 6 to 30 (~860Hz to ~5kHz)
    // High: bins 31 to 127 (~5kHz+)

    let bassSum = 0;
    for (let i = 0; i < 6; i++) {
      bassSum += this.dataArray[i];
    }
    
    let midSum = 0;
    for (let i = 6; i < 31; i++) {
      midSum += this.dataArray[i];
    }

    let highSum = 0;
    for (let i = 31; i < 127; i++) {
      highSum += this.dataArray[i];
    }

    return {
      bass: (bassSum / 6) / 255,
      mid: (midSum / 25) / 255,
      high: (highSum / 96) / 255,
    };
  }
}

// Export singleton
export const audioManager = new AudioManager();
