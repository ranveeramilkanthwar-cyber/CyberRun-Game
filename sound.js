// Web Audio API Sound Synthesizer for Fall Guys CyberRun
class SoundEngine { constructor() { this.ctx = null; } init() { if(!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } playTone(freq, dur) { if(!this.ctx) return; const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain(); osc.frequency.value = freq; osc.connect(gain); gain.connect(this.ctx.destination); osc.start(); gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur); osc.stop(this.ctx.currentTime + dur); } } export const sound = new SoundEngine();

export function playJumpSound() { sound.init(); sound.playTone(440, 0.15); }
export function playBounceSound() { sound.init(); sound.playTone(880, 0.2); }
export function playCheckpointSound() { sound.init(); sound.playTone(587, 0.3); }
