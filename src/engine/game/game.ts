import { bind } from "@/engine/util/decorator";
import { Scene } from "@/engine/game/scene";

export class Game {
  private static readonly TARGET_DT = 1 / 60;

  public scene: Scene = new Scene();

  private last: number | null = null;
  private frame: number | null = null;

  public start(): void {
    this.frame = requestAnimationFrame(this.update);
  }

  public stop(): void {
    if (this.frame) {
      cancelAnimationFrame(this.frame);
      this.frame = null;
    }
  }

  @bind
  private update(): void {
    const now = performance.now();
    let dt = Game.TARGET_DT;

    if (this.last) {
      dt = (now - this.last) / 1000;
    }

    this.last = now;

    for (const system of this.scene.systems.getAll()) {
      system.update(this.scene, dt);
    }

    this.frame = requestAnimationFrame(this.update);
  }
}
