import { Mat3x3Like } from "@/engine/math/mat3x3";

export namespace Canvas {
  export function applyTransform(
    ctx: CanvasRenderingContext2D,
    mat: Readonly<Mat3x3Like>,
  ): void {
    ctx.transform(mat[0], mat[1], mat[3], mat[4], mat[6], mat[7]);
  }
}
