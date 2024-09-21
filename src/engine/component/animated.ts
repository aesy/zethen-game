import { Component, ComponentId } from "@/engine/component";

export interface Animation {
  getFrame(): CanvasImageSource;
  tick(dt: number): void;
  play(): void;
  pause(): void;
  stop(): void;
}

class StateAnimator<T extends string | number | symbol> implements Animation {
  constructor(
    private states: Record<T, Animation>,
    private currentState: T,
  ) {}

  public setState(state: T) {
    this.currentState = state;
  }

  public getFrame(): CanvasImageSource {
    return this.states[this.currentState].getFrame();
  }

  public tick(dt: number): void {
    this.states[this.currentState].tick(dt);
  }

  public play(): void {
    this.states[this.currentState].play();
  }

  public pause(): void {
    this.states[this.currentState].pause();
  }

  public stop(): void {
    this.states[this.currentState].stop();
  }
}

export class FrameAnimation implements Animation {
  private playing = true;
  private currentTime = 0;
  private currentFrame = 0;

  public constructor(
    private frames: CanvasImageSource[],
    private frameTimeSeconds = 0,
  ) {
    console.assert(frames.length > 0, "Frames must be more than zero");
  }

  public getFrame(): CanvasImageSource {
    return this.frames[this.currentFrame];
  }

  public tick(dt: number) {
    if (!this.playing) {
      return;
    }

    this.currentTime += dt;

    while (this.currentTime >= this.frameTimeSeconds) {
      this.currentTime -= this.frameTimeSeconds;
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
    }
  }

  public play(): void {
    this.playing = true;
  }

  public pause(): void {
    this.playing = false;
  }

  public stop(): void {
    this.playing = false;
    this.reset();
  }

  public reset(): void {
    this.currentFrame = 0;
    this.currentTime = 0;
  }
}

export class Animated implements Component {
  public static readonly id: ComponentId = ComponentId.next();

  public constructor(public animation: Animation) {}
}
