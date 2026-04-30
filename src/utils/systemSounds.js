import { XP_SOUNDS_ENABLED_STORAGE_KEY, readStoredValue } from './systemSettings';

let audioContext = null;

const SOUND_PATTERNS = {
  click: [
    { frequency: 780, duration: 0.018, gain: 0.018, type: 'square' },
    { frequency: 560, duration: 0.028, gain: 0.014, type: 'triangle' },
  ],
  folder: [
    { frequency: 420, duration: 0.045, gain: 0.025, type: 'sine' },
    { frequency: 640, duration: 0.06, gain: 0.02, type: 'triangle', delay: 0.03 },
  ],
  error: [
    { frequency: 210, duration: 0.09, gain: 0.03, type: 'sawtooth' },
    { frequency: 150, duration: 0.12, gain: 0.03, type: 'square', delay: 0.08 },
  ],
};

export function areSystemSoundsEnabled() {
  return readStoredValue(XP_SOUNDS_ENABLED_STORAGE_KEY, true);
}

function getAudioContext() {
  if (typeof window === 'undefined') {
    return null;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return null;
  }

  if (!audioContext) {
    audioContext = new AudioContextClass();
  }

  if (audioContext.state === 'suspended') {
    audioContext.resume().catch(() => {});
  }

  return audioContext;
}

export function playSystemSound(type) {
  if (!areSystemSoundsEnabled()) {
    return;
  }

  const ctx = getAudioContext();
  const pattern = SOUND_PATTERNS[type];

  if (!ctx || !pattern) {
    return;
  }

  const startTime = ctx.currentTime + 0.005;

  pattern.forEach(({ frequency, duration, gain, type: oscillatorType, delay = 0 }) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const nodeStart = startTime + delay;
    const nodeEnd = nodeStart + duration;

    oscillator.type = oscillatorType;
    oscillator.frequency.setValueAtTime(frequency, nodeStart);

    gainNode.gain.setValueAtTime(0.0001, nodeStart);
    gainNode.gain.exponentialRampToValueAtTime(gain, nodeStart + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, nodeEnd);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.start(nodeStart);
    oscillator.stop(nodeEnd + 0.01);
  });
}
