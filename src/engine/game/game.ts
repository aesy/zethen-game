import { bind } from "@/engine/util/bind";
import { Scene } from "@/engine/game/scene";
import { FpsCounter } from "@/engine/game/fps";

export class Game {
  private static readonly TARGET_DT = 1 / 60;

  private _scene: Scene = new Scene();
  private readonly fpsCounter: FpsCounter = new FpsCounter(0.5);
  private running: boolean = false;
  private lastTimestamp: number | null = null;
  private frame: number | null = null;

  public get isRunning(): boolean {
    return this.running;
  }

  public get fps(): number {
    return this.fpsCounter.currentFps;
  }

  public get scene(): Scene {
    return this._scene;
  }

  public changeScene(scene: Scene): void {
    this._scene.dispose();
    this._scene = scene;
  }

  public start(): void {
    if (!this.running) {
      this.running = true;
      this.frame = requestAnimationFrame(this.update);
    }
  }

  public stop(): void {
    if (this.running) {
      this.running = false;
      this.lastTimestamp = null;

      if (this.frame) {
        cancelAnimationFrame(this.frame);
        this.frame = null;
      }

      this.fpsCounter.reset();
    }
  }

  @bind
  private update(): void {
    const currentTimestamp = performance.now();

    let dt: number;
    if (this.lastTimestamp) {
      dt = (currentTimestamp - this.lastTimestamp) / 1000;
    } else {
      dt = Game.TARGET_DT;
    }

    this.lastTimestamp = currentTimestamp;
    this.fpsCounter.tick(dt);

    for (const system of this._scene.systems.getAll()) {
      system.update(this._scene, dt);
    }

    if (Math.random() > 0.95) {
      // console.log("fps", Math.round(this.fpsCounter.currentFps * 10) / 10);
    }

    this.frame = requestAnimationFrame(this.update);
  }
}
