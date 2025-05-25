import { Vec2Like } from "@/engine/math/vec2";
import { RectLike } from "@/engine/math/rect";
import { Dim2Like } from "@/engine/math/dim2";

export class DualSquareGrid {
  public constructor(private readonly gridSize: Readonly<Dim2Like>) {}

  public getWorldCell(position: Readonly<Vec2Like>): RectLike {
    return {
      x: position.x * this.gridSize.width,
      y: position.y * this.gridSize.height,
      width: this.gridSize.width,
      height: this.gridSize.height,
    };
  }

  public getOffsetCell(position: Readonly<Vec2Like>): RectLike {
    return {
      x: position.x * this.gridSize.width - this.gridSize.width / 2,
      y: position.y * this.gridSize.height - this.gridSize.height / 2,
      width: this.gridSize.width,
      height: this.gridSize.height,
    };
  }
}
