export interface SpeakOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
}

class Pronounce {
  private synth: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.synth = window.speechSynthesis;
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = this.loadVoices;
    }
    this.loadVoices();
  }

  private loadVoices = () => {
    this.voices = this.synth.getVoices();
  };

  public speak(text: string, options: SpeakOptions = {}) {
    if (!this.synth) {
      options.onError?.(new Error("SpeechSynthesis not supported"));
      return;
    }

    // Cancel any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Default options
    utterance.rate = options.rate || 0.9; // Slightly slower for learning
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;

    // Select voice
    let voice = this.voices.find(v => v.lang === 'en-US' && !v.localService); // Prefer remote en-US (usually better quality)
    if (!voice) {
      voice = this.voices.find(v => v.lang === 'en-US');
    }
    if (!voice) {
      voice = this.voices.find(v => v.lang.startsWith('en'));
    }
    
    if (voice) {
      utterance.voice = voice;
    }

    // Event handlers
    utterance.onstart = () => options.onStart?.();
    utterance.onend = () => options.onEnd?.();
    utterance.onerror = (e) => options.onError?.(e);

    this.synth.speak(utterance);
  }

  public cancel() {
    this.synth.cancel();
  }

  public isSupported(): boolean {
    return !!window.speechSynthesis;
  }
}

export const pronounce = new Pronounce();
