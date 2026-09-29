/**
 * Web Speech Synthesis utility for Hindi and English pronunciation
 */

let hindiVoice: SpeechSynthesisVoice | null = null;

function loadVoices(): Promise<SpeechSynthesisVoice | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve(null);
      return;
    }

    const checkVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const match = voices.find(
        (v) => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi') || v.lang === 'hi-IN'
      ) || voices.find((v) => v.lang.startsWith('en-IN')) || voices[0] || null;
      hindiVoice = match;
      return match;
    };

    const immediate = checkVoices();
    if (immediate) {
      resolve(immediate);
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        resolve(checkVoices());
      };
      // Fallback timeout if onvoiceschanged doesn't fire
      setTimeout(() => resolve(checkVoices()), 500);
    }
  });
}

export async function speakText(
  text: string,
  options?: {
    rate?: number;
    pitch?: number;
    lang?: string;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: unknown) => void;
  }
): Promise<void> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    options?.onError?.(new Error('Speech synthesis not supported in this browser.'));
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const voice = hindiVoice || (await loadVoices());
  const utterance = new SpeechSynthesisUtterance(text);

  if (voice) {
    utterance.voice = voice;
  }
  utterance.lang = options?.lang || (voice?.lang ?? 'hi-IN');
  utterance.rate = options?.rate ?? 0.85; // Slightly slower for clear Hindi diction
  utterance.pitch = options?.pitch ?? 1.0;

  utterance.onstart = () => {
    options?.onStart?.();
  };

  utterance.onend = () => {
    options?.onEnd?.();
  };

  utterance.onerror = (e) => {
    // Ignore canceled events which happen on user quick re-clicks
    if (e.error !== 'canceled') {
      options?.onError?.(e);
    }
    options?.onEnd?.();
  };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
