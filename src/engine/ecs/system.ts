import { Scene } from "@/engine/game/scene";

export type System = {
  init?(scene: Scene): void;
  update(scene: Scene, dt: number): void;
};
