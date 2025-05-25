import { Scene } from "@/engine/game/scene";
import { System } from "@/engine/ecs/system";

export class ConstantUpdate implements System {
  private remainingTime: number = 0;

  constructor(
    private readonly systems: Iterable<System>,
    private readonly targetDt: number,
    delay: number = 0,
  ) {
    this.remainingTime += delay;
  }

  public init(scene: Scene): void {
    for (const system of this.systems) {
      system.init?.(scene);
    }
  }

  public update(scene: Scene, dt: number): void {
    this.remainingTime += dt;

    while (this.remainingTime >= this.targetDt) {
      this.remainingTime -= this.targetDt;

      for (const system of this.systems) {
        system.update(scene, this.targetDt);
      }
    }

    this.remainingTime = this.remainingTime;
  }
}
