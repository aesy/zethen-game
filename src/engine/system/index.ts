import { Scene } from "@/engine/game/scene";

export interface System {
  init?(scene: Scene): void;
  update(scene: Scene, dt: number): void;
}
