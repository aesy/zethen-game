import { Arrays } from "@/engine/util/arrays";
import { RectLike } from "@/engine/math/rect";
import { Pnt2, Pnt2Like } from "@/engine/math/pnt2";
import { Dim2Like } from "@/engine/math/dim2";

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
    settings: {
      gridSize: Readonly<Dim2Like>;
      gridOffset?: Readonly<Pnt2Like>;
      gridSpacing?: Readonly<Pnt2Like>;
    },
  ): Promise<ImageBitmap[][]> {
    const { width: imageWidth, height: imageHeight } = image;
    const { x: offsetX, y: offsetY } = settings.gridOffset ?? Pnt2.ORIGIN;
    const { width: spriteWidth, height: spriteHeight } = settings.gridSize;
    const { x: spacingX, y: spacingY } = settings.gridSpacing ?? Pnt2.ORIGIN;
    const cols = Math.floor(
      (imageWidth - offsetX + spacingX) / (spriteWidth + spacingX),
    );
    const rows = Math.floor(
      (imageHeight - offsetY + spacingY) / (spriteHeight + spacingY),
    );
    const promises: Promise<ImageBitmap>[] = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = offsetX + col * (spriteWidth + spacingX);
        const y = offsetY + row * (spriteHeight + spacingY);

        promises.push(
          createImageBitmap(image, x, y, spriteWidth, spriteHeight),
        );
      }
    }

    const sprites = await Promise.all(promises);

    return Arrays.chunk(sprites, rows);
  }
}
