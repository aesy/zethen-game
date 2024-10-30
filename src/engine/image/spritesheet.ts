import { RectLike } from "@/engine/math/rect";
import { Pnt2, Pnt2Like } from "@/engine/math/pnt2";

export namespace SpriteSheet {
  export async function fromPredefined(
    image: ImageBitmapSource,
    sections: Readonly<RectLike>[],
  ): Promise<ImageBitmap[]> {
    const promises = sections.map((frame) =>
      createImageBitmap(image, frame.x, frame.y, frame.width, frame.height),
    );

    return await Promise.all(promises);
  }

  export async function fromFixedGrid(
    image:
      | ImageBitmap
      | HTMLVideoElement
      | ImageData
      | HTMLImageElement
      | HTMLCanvasElement
      | OffscreenCanvas,
    gridSize: Readonly<RectLike>,
    gridOffset: Readonly<Pnt2Like> = Pnt2.ORIGIN,
  ): Promise<ImageBitmap[]> {
    const { width: imageWidth, height: imageHeight } = image;
    const { x: offsetX, y: offsetY } = gridOffset;
    const { width: spriteWidth, height: spriteHeight } = gridSize;
    const cols = Math.floor((imageWidth - offsetX) / spriteWidth);
    const rows = Math.floor((imageHeight - offsetY) / spriteHeight);
    const promises: Promise<ImageBitmap>[] = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = offsetX + col * spriteWidth;
        const y = offsetY + row * spriteHeight;

        promises.push(
          createImageBitmap(image, x, y, spriteWidth, spriteHeight),
        );
      }
    }

    return await Promise.all(promises);
  }
}
