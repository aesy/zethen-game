import { Vec2Like } from "@/engine/math/vec2";
import { RectLike } from "@/engine/math/rect";
import { Dim2Like } from "@/engine/math/dim2";

export class SquareGrid {
  public constructor(private readonly gridSize: Readonly<Dim2Like>) {}

  public getCell(position: Readonly<Vec2Like>): RectLike {
    return {
      x: position.x * this.gridSize.width,
      y: position.y * this.gridSize.height,
      width: this.gridSize.width,
      height: this.gridSize.height,
    };
  }
}
