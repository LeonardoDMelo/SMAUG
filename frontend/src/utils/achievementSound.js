let audioCtx = null;

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioCtx) audioCtx = new AudioContextClass();
  return audioCtx;
};

export const playAchievementSound = async () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    await ctx.resume();
  }

  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.22, now + 0.02);
  master.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);
  master.connect(ctx.destination);

  const notes = [
    { freq: 523.25, start: 0, duration: 0.18 },
    { freq: 659.25, start: 0.12, duration: 0.18 },
    { freq: 783.99, start: 0.24, duration: 0.22 },
    { freq: 1046.5, start: 0.38, duration: 0.35 },
  ];

  notes.forEach(({ freq, start, duration }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + start);

    gain.gain.setValueAtTime(0.0001, now + start);
    gain.gain.exponentialRampToValueAtTime(0.7, now + start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);

    osc.connect(gain);
    gain.connect(master);

    osc.start(now + start);
    osc.stop(now + start + duration + 0.02);
  });
};
