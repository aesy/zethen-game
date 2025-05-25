export function loadAudio(src: string): Promise<HTMLAudioElement> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(src);
    audio.autoplay = false;
    audio.preload = "auto";
    audio.oncanplaythrough = () => resolve(audio);
    audio.onerror = (error) => reject(`Failed to load audio: ${error}`);
    audio.src = src;
    return audio;
  });
}
