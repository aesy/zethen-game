import { Player } from "@/game/archetype/player";
import { loadImage } from "@/engine/util/image";
import { Scene } from "@/engine/game/scene";
import { System } from "@/engine/ecs/system";
import heartFullImg from "@/assets/sprites/heart_full.png";
import heartEmptyImg from "@/assets/sprites/heart_empty.png";

const heartFull = await loadImage(heartFullImg);
const heartEmpty = await loadImage(heartEmptyImg);

export class GuiSystem implements System {
  constructor(private readonly context: CanvasRenderingContext2D) {}

  public update({ entities }: Scene, _dt: number): void {
    const ctx = this.context;
    const player = entities.queryFirstEntity(Player);

    if (player) {
      ctx.imageSmoothingEnabled = false;

      for (let i = 0; i < player.health.hpTotal; i++) {
        let img;
        if (i < player.health.hpLeft) {
          img = heartFull;
        } else {
          img = heartEmpty;
        }

        const ratio = ctx.canvas.width / 1280;
        const spacing = 8 * ratio;
        const margin = 16 * ratio;
        const size = 42 * ratio;

        ctx.drawImage(
          img!,
          margin + i * spacing + i * size,
          ctx.canvas.height - size - margin,
          size,
          size,
        );
      }
    }
  }
}
