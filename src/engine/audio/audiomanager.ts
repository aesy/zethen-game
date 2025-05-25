// TODO fade in/out
// TODO panning

export class AudioManager {
  public readonly ctx: AudioContext;
  private readonly sounds: Map<
    HTMLMediaElement,
    {
      playing: boolean;
      node: AudioNode;
    }
  > = new Map();

  public constructor() {
    this.ctx = new AudioContext({
      latencyHint: "interactive",
    });
  }

  public play(
    media: HTMLMediaElement,
    options?: {
      loop?: boolean;
      volume?: number;
    },
  ): void {
    const { ctx } = this;

    let sound = this.sounds.get(media);

    if (!sound) {
      const node = ctx.createMediaElementSource(media);
      node.connect(ctx.destination);
      sound = {
        playing: false,
        node,
      };
      this.sounds.set(media, sound);
    }

    if (!sound.playing) {
      // TODO cleanup?
      media.addEventListener(
        "ended",
        () => {
          sound.playing = false;
        },
        false,
      );

      void media.play();
    }
  }

  public pause(media: HTMLMediaElement): void {
    media.pause();
  }

  // TODO toggle
  // TODO mute / unmute
  // TODO volume
  // TODO layers
  // TODO isSuspended
  // TODO unSuspend
  // TODO dispose (disconnect and close)

  public stop(media: HTMLMediaElement): void {
    const sound = this.sounds.get(media);

    if (sound) {
      media.pause();
      this.sounds.delete(media);
      sound.node.disconnect();
    }
  }
}
