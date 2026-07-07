// Web Audio API Sound Synthesizer for Ops Cockpit Action feedback
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume context if suspended (browser security policy)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playApproveSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Dual-tone chime: First tone
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.12); // E5
    
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    
    osc1.start(now);
    osc1.stop(now + 0.3);

    // Second tone starting slightly delayed
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(783.99, now + 0.08); // G5
    
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.setValueAtTime(0.1, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
    
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    
    osc2.start(now + 0.08);
    osc2.stop(now + 0.38);
  } catch (error) {
    console.warn("Failed to play approve sound:", error);
  }
}

export function playHoldSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle'; // Warmer, softer sound for hold
    osc.frequency.setValueAtTime(392.00, now); // G4
    osc.frequency.exponentialRampToValueAtTime(329.63, now + 0.18); // E4
    
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.25);
  } catch (error) {
    console.warn("Failed to play hold sound:", error);
  }
}
