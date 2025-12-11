const sounds = {
    approval: new Audio("/src/assets/sfx/approve.mp3"),
    automated: new Audio("/src/assets/sfx/auto.mp3"),
  };
  
  export const playSound = (type: string) => {
    const sound = sounds[type];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {});
    }
  };