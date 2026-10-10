/**
 * Studio Audio Engine using Web Audio API
 * Generates chill, focused music-studio soundscapes (Rhodes chords, tape warmth, ambient pad)
 * without requiring any external mp3 files.
 */

class StudioAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private masterGain: GainNode | null = null;
  private noiseNode: AudioNode | null = null;
  private noiseGain: GainNode | null = null;
  private chordIntervalId: number | null = null;
  private currentMode: 'tape-crackle' | 'rhodes' | 'ambient-pad' = 'rhodes';
  private volume = 0.25;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getMode(): string {
    return this.currentMode;
  }

  public setMode(mode: 'tape-crackle' | 'rhodes' | 'ambient-pad') {
    this.currentMode = mode;
    if (this.isPlaying) {
      this.stop();
      this.start(mode);
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public start(mode?: 'tape-crackle' | 'rhodes' | 'ambient-pad') {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (mode) this.currentMode = mode;
    this.stop(); // clear any existing sound

    this.isPlaying = true;

    if (this.currentMode === 'tape-crackle' || this.currentMode === 'rhodes') {
      this.startVinylTapeNoise();
    }

    if (this.currentMode === 'rhodes') {
      this.startRhodesProgression();
    } else if (this.currentMode === 'ambient-pad') {
      this.startAmbientPad();
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.chordIntervalId) {
      window.clearInterval(this.chordIntervalId);
      this.chordIntervalId = null;
    }
    if (this.noiseNode) {
      try {
        (this.noiseNode as AudioBufferSourceNode).stop?.();
      } catch {
        // ignore
      }
      this.noiseNode.disconnect();
      this.noiseNode = null;
    }
    if (this.noiseGain) {
      this.noiseGain.disconnect();
      this.noiseGain = null;
    }
  }

  public toggle(mode?: 'tape-crackle' | 'rhodes' | 'ambient-pad'): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start(mode);
      return true;
    }
  }

  // Generates subtle analog vinyl/tape crackle
  private startVinylTapeNoise() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      // Pinkish noise with occasional crackle pop
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.02 * white) / 1.02;
      const crackle = Math.random() > 0.998 ? (Math.random() - 0.5) * 0.4 : 0;
      data[i] = lastOut * 0.12 + crackle;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    // Filter to warm vinyl frequencies
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noiseSource.start();
    this.noiseNode = noiseSource;
    this.noiseGain = gain;
  }

  // Plays gentle electric piano chords (F#maj7 -> D#m7 -> Bmaj7 -> C#7)
  private startRhodesProgression() {
    if (!this.ctx) return;

    // Frequencies in Hz for warm studio jazz/neo-soul chords
    const chords: number[][] = [
      [185.00, 277.18, 349.23, 440.00], // F#maj9
      [155.56, 233.08, 277.18, 349.23], // D#m9
      [246.94, 311.13, 369.99, 440.00], // Bmaj7
      [277.18, 349.23, 415.30, 493.88], // C#add9
    ];

    let currentChordIndex = 0;

    const playChord = () => {
      if (!this.ctx || !this.isPlaying || !this.masterGain) return;
      const notes = chords[currentChordIndex];
      currentChordIndex = (currentChordIndex + 1) % chords.length;

      const now = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        // Sine + gentle triangle for warm Rhodes chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq * 2, now + idx * 0.04);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.frequency.exponentialRampToValueAtTime(450, now + 3.5);

        // Soft attack & long dreamy decay
        const startTime = now + idx * 0.04;
        noteGain.gain.setValueAtTime(0, startTime);
        noteGain.gain.linearRampToValueAtTime(0.06, startTime + 0.12);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 4.5);

        osc.connect(filter);
        osc2.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(this.masterGain);

        osc.start(startTime);
        osc2.start(startTime);
        osc.stop(startTime + 4.6);
        osc2.stop(startTime + 4.6);
      });
    };

    playChord();
    this.chordIntervalId = window.setInterval(playChord, 5200);
  }

  // Generates a soft ambient synth pad
  private startAmbientPad() {
    if (!this.ctx || !this.masterGain) return;
    const chord = [138.59, 207.65, 277.18, 329.63, 415.30]; // C#m9 pad

    chord.forEach((freq) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, this.ctx.currentTime);

      oscGain.gain.setValueAtTime(0.025, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(this.masterGain);

      osc.start();
    });
  }
}

export const studioAudio = new StudioAudioEngine();
