// src/utils/soundPlayer.ts
const SOUND_PATH = "/sounds"; // put audio files in public/sounds/

const mapping: Record<string, string> = {
  start: `${SOUND_PATH}/start.mp3`,
  task: `${SOUND_PATH}/task.mp3`,
  approval: `${SOUND_PATH}/approval.mp3`,
  automated: `${SOUND_PATH}/automated.mp3`,
  end: `${SOUND_PATH}/end.mp3`,
  connect: `${SOUND_PATH}/connect.mp3`,
  delete: `${SOUND_PATH}/delete.mp3`,
  layout: `${SOUND_PATH}/layout.mp3`,
  run: `${SOUND_PATH}/run.mp3`,
  step: `${SOUND_PATH}/step.mp3`,
  success: `${SOUND_PATH}/success.mp3`,
  error: `${SOUND_PATH}/error.mp3`,
};

const cache: Record<string, HTMLAudioElement | null> = {};

export function playNodeSound(key: string) {
  const src = mapping[key];
  if (!src) return;
  try {
    if (!cache[src]) {
      cache[src] = new Audio(src);
    }
    const audio = cache[src]!;
    audio.currentTime = 0;
    // try/catch to avoid autoplay issues
    audio.play().catch(() => {
      // ignore autoplay block; no further action
    });
  } catch (e) {
    // ignore
  }
}