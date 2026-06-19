export function notifyRestComplete(preferences: { restSoundEnabled: boolean; restVibrationEnabled: boolean }) {
  if (preferences.restVibrationEnabled && 'vibrate' in navigator) {
    navigator.vibrate([200, 100, 200]);
  }

  if (preferences.restSoundEnabled) {
    // beep simples via Web Audio API, sem precisar de arquivo de áudio externo
    try {
      const ctx = new AudioContext();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.frequency.value = 880;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.5);
    } catch {
      // navegador sem suporte — ignora silenciosamente
    }
  }
}