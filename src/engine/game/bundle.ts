import { Scene } from "@/engine/game/scene";

export interface Bundle {
  init(scene: Scene): void;
}
