import { Scene } from "@/engine/game/scene";
import { System } from "@/engine/ecs/system";

export class UISystem implements System {
  public update(_scene: Scene, _dt: number): void {
    throw new Error("Method not implemented.");
  }
}
