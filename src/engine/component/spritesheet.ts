import { Rect } from "@/engine/math/rect";

class TileSet {}

export function createSpritesFromSheet(
  sheet: ImageBitmapSource,
  frames: Rect[],
): Promise<ImageBitmap[]> {
  return Promise.all(
    frames.map((frame) =>
      createImageBitmap(
        sheet,
        frame.position.x,
        frame.position.y,
        frame.size.width,
        frame.size.height,
        { resizeQuality: "pixelated" },
      ),
    ),
  );
}
