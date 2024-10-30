import { Scene } from "@/engine/game/scene";

export type Bundle = {
  init(scene: Scene): void;
};
