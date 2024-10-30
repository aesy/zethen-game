import { Component, ComponentId } from "@/engine/component";

export type Animation = {
  getFrame(): CanvasImageSource;
  tick(dt: number): void;
  resume(): void;
  pause(): void;
  stop(): void;
  reset(): void;
};

export enum CharacterAnimation {
  IDLE = "IDLE",
  WALKING = "WALKING",
  RUNNING = "RUNNING",
  JUMPING = "JUMPING",
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

  public resume(): void {
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
  public speedModifier: number = 1;

  constructor(
    private animations: Record<string, Animation>,
    private currentState: string,
  ) {}

  public play(name: string) {
    if (name !== this.currentState) {
      if (this.animations.hasOwnProperty(name)) {
        this.reset();
        this.currentState = name;
      } else {
        console.warn(`Tried to set non-existent animatino ${name}`);
      }
    }
  }

  public getImage(): CanvasImageSource {
    return this.animations[this.currentState].getFrame();
  }

  public tick(dt: number): void {
    this.animations[this.currentState].tick(dt * this.speedModifier);
  }

  public resume(): void {
    this.animations[this.currentState].resume();
  }

  public pause(): void {
    this.animations[this.currentState].pause();
  }

  public stop(): void {
    this.animations[this.currentState].stop();
  }

  public reset(): void {
    this.speedModifier = 1;
    this.animations[this.currentState].reset();
  }
}
