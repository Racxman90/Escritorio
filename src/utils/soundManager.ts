// Windows XP Sound Effect Manager

const SOUND_BASE = `${import.meta.env.BASE_URL}sounds/`;

class SoundManager {
  private audioContext: AudioContext | null = null;
  private startupAudio: HTMLAudioElement | null = null;
  private clickPool: HTMLAudioElement[] = [];
  private poolIndex = 0;
  private poolSize = 6;
  private isMuted = false;
  private volume = 0.13; // Set default volume strictly to 13% as requested
  private hasPlayedStartup = false;
  private isInitialized = false;

  constructor() {
    // Read persisted volume if exists, or maintain at 13%
    if (typeof window !== 'undefined') {
      try {
        const savedVol = localStorage.getItem('xp_system_volume');
        if (savedVol !== null) {
          const parsed = parseFloat(savedVol);
          if (!isNaN(parsed)) {
            this.volume = Math.max(0, Math.min(1, parsed));
          }
        } else {
          this.volume = 0.13;
          localStorage.setItem('xp_system_volume', '0.13');
        }
      } catch {
        this.volume = 0.13;
      }

      // Lazy initialize on first interaction to comply with browser autoplay policies
      const initAudio = () => {
        this.init();
        if (!this.hasPlayedStartup) {
          this.playStartup();
        }
        window.removeEventListener('pointerdown', initAudio);
        window.removeEventListener('keydown', initAudio);
      };

      window.addEventListener('pointerdown', initAudio, { once: true });
      window.addEventListener('keydown', initAudio, { once: true });
    }
  }

  private init() {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    try {
      // Pre-load startup sound with calibrated 13% volume
      this.startupAudio = new Audio(`${SOUND_BASE}xp-startup.wav`);
      this.startupAudio.volume = this.volume;

      // Pre-allocate audio pool for zero-latency click sounds calibrated to volume
      this.clickPool = Array.from({ length: this.poolSize }, () => {
        const audio = new Audio(`${SOUND_BASE}xp-click.wav`);
        audio.volume = Math.min(1, this.volume * 0.75);
        return audio;
      });
    } catch {
      // Audio not supported or failed to instantiate
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioContext) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
      }
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => {});
    }
    return this.audioContext;
  }

  /**
   * Play the classic Windows XP Startup sound
   */
  public playStartup() {
    if (this.isMuted) return;
    this.hasPlayedStartup = true;
    this.init();

    if (this.startupAudio) {
      this.startupAudio.currentTime = 0;
      this.startupAudio
        .play()
        .catch(() => {
          // Fallback to Web Audio synthesis if file play was blocked or unavailable
          this.synthesizeStartupChord();
        });
    } else {
      this.synthesizeStartupChord();
    }
  }

  /**
   * Play the classic Windows XP navigation / button click sound
   */
  public playClick() {
    if (this.isMuted) return;
    this.init();

    if (this.clickPool.length > 0) {
      const audio = this.clickPool[this.poolIndex];
      this.poolIndex = (this.poolIndex + 1) % this.poolSize;

      audio.currentTime = 0;
      audio.play().catch(() => {
        // Fallback to Web Audio synthesis click
        this.synthesizeClick();
      });
    } else {
      this.synthesizeClick();
    }
  }

  /**
   * Toggle mute state
   */
  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.startupAudio) {
      this.startupAudio.pause();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.isMuted && this.startupAudio) {
      this.startupAudio.pause();
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('xp_system_volume', this.volume.toString());
    } catch {
      // Storage unavailable
    }
    if (this.startupAudio) {
      this.startupAudio.volume = this.volume;
    }
    this.clickPool.forEach((audio) => {
      audio.volume = Math.min(1, this.volume * 0.75);
    });
  }

  /**
   * Synthetic click generator using Web Audio API as a fail-safe
   */
  private synthesizeClick() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400, ctx.currentTime);
      filter.Q.setValueAtTime(3.0, ctx.currentTime);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.025);

      const targetGain = Math.max(0.001, 0.12 * (this.volume / 0.7));
      gain.gain.setValueAtTime(targetGain, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.025);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.03);
    } catch {
      // Web Audio unsupported
    }
  }

  /**
   * Synthetic Windows XP chord generator as a fail-safe
   */
  private synthesizeStartupChord() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      // Iconic XP harmony notes: Eb3, Bb3, Eb4, G4, Bb4, C5, Eb5
      const freqs = [155.56, 233.08, 311.13, 392.0, 466.16, 523.25, 622.25];
      const now = ctx.currentTime;

      freqs.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.12);

        const startTime = now + index * 0.12;
        const peakGain = Math.max(0.001, 0.08 * (this.volume / 0.7));
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(peakGain, startTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 2.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 2.6);
      });
    } catch {
      // AudioContext unavailable
    }
  }
}

export const soundManager = new SoundManager();
