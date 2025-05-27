import { Transform2D } from "@/game/component/transform2D";
import { Vec2 } from "@/engine/math/vec2";
import { Rect, RectLike } from "@/engine/math/rect";
import { Pnt2, Pnt2Like } from "@/engine/math/pnt2";
import { Mat3x3, Mat3x3Like } from "@/engine/math/mat3x3";
import { Dim2, Dim2Like } from "@/engine/math/dim2";
import { Component, ComponentId } from "@/engine/ecs/component";

// https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/script-CanvasScaler.html
// https://docs.godotengine.org/en/stable/tutorials/rendering/multiple_resolutions.html
export enum ScaleMode {
  NO_CHANGE,
  CHANGE_WIDTH_TO_FIT_CANVAS,
  CHANGE_HEIGHT_TO_FIT_CANVAS,
  CHANGE_SHORTEST_SIDE_TO_FIT_CANVAS,
  CHANGE_LONGEST_SIDE_TO_FIT_CANVAS,
  CHANGE_LENGTH_TO_FIT_CANVAS,
}

// TODO limit
// TODO smoothing
// TODO speed
// TODO offset
// TODO isCurrent
export class Camera implements Component {
  public static readonly id: ComponentId = ComponentId.next();

  public constructor(
    public mode: ScaleMode,
    public safeZone: Dim2,
  ) {}

  public static worldToScreen(
    camera: Readonly<Mat3x3Like>,
    point: Readonly<Pnt2Like>,
  ): Pnt2Like {
    const viewMatrix = Mat3x3.inverse(camera);

    if (!viewMatrix) {
      return Pnt2.ORIGIN;
    }

    return Pnt2.transformMat3(point, viewMatrix);
  }

  public static screenToWorld(
    camera: Readonly<Mat3x3Like>,
    point: Readonly<Pnt2Like>,
  ): Pnt2Like {
    return Pnt2.transformMat3(point, camera);
  }

  public getMatrix(
    transform: Readonly<Transform2D>,
    canvas: Readonly<Dim2Like>,
  ): Mat3x3 {
    const zoom = this.getZoomLevel(canvas);
    const scaleX = transform.scale.x / zoom;
    const scaleY = transform.scale.y / zoom;
    const cos = Math.cos(transform.rotation);
    const sin = Math.sin(transform.rotation);

    // prettier-ignore
    return Mat3x3.from([
      scaleX * cos, scaleX * sin, 0,
      -scaleY * sin, scaleY * cos, 0,
      transform.position.x, transform.position.y, 1
    ]);
  }

  public getViewMatrix(
    transform: Readonly<Transform2D>,
    canvas: Readonly<Dim2Like>,
  ): Mat3x3 {
    return this.getMatrix(transform, canvas).invert() ?? Mat3x3.identity();
  }

  public isPointInView(
    camera: Readonly<Transform2D>,
    position: Readonly<Pnt2Like>,
    canvas: Readonly<Dim2Like>,
  ): boolean {
    const matrix = this.getMatrix(camera, canvas).data;
    const screenPos = Camera.worldToScreen(matrix, position);

    return Rect.containsPoint(
      {
        x: -canvas.width / 2,
        y: -canvas.height / 2,
        width: canvas.width,
        height: canvas.height,
      },
      screenPos,
    );
  }

  public isRectInView(
    camera: Readonly<Transform2D>,
    rect: Readonly<RectLike>,
    canvas: Readonly<Dim2Like>,
  ): boolean {
    // TODO optimize, move out to functions
    const view = {
      x: -canvas.width / 2,
      y: -canvas.height / 2,
      width: canvas.width,
      height: canvas.height,
    };
    const matrix = this.getMatrix(camera, canvas)!.data;
    const topLeft = Camera.worldToScreen(matrix, Rect.getTopLeft(rect));
    const topRight = Camera.worldToScreen(matrix, Rect.getTopRight(rect));
    const bottomRight = Camera.worldToScreen(matrix, Rect.getBottomRight(rect));
    const bottomLeft = Camera.worldToScreen(matrix, Rect.getBottomLeft(rect));

    const screenRect = {
      x: Math.min(topLeft.x, topRight.x, bottomRight.x, bottomLeft.x),
      y: Math.min(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y),
      width:
        Math.max(topLeft.x, topRight.x, bottomRight.x, bottomLeft.x) -
        Math.min(topLeft.x, topRight.x, bottomRight.x, bottomLeft.x),
      height:
        Math.max(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y) -
        Math.min(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y),
    };

    return !(
      screenRect.x + screenRect.width < view.x ||
      screenRect.x > view.x + view.width ||
      screenRect.y + screenRect.height < view.y ||
      screenRect.y > view.y + view.height
    );
  }

  private getZoomLevel(canvas: Readonly<Dim2Like>): number {
    switch (this.mode) {
      case ScaleMode.NO_CHANGE:
        return 1;
      case ScaleMode.CHANGE_WIDTH_TO_FIT_CANVAS:
        return canvas.width / this.safeZone.width;
      case ScaleMode.CHANGE_HEIGHT_TO_FIT_CANVAS:
        return canvas.height / this.safeZone.height;
      case ScaleMode.CHANGE_SHORTEST_SIDE_TO_FIT_CANVAS:
        return Math.min(
          canvas.width / this.safeZone.width,
          canvas.height / this.safeZone.height,
        );
      case ScaleMode.CHANGE_LONGEST_SIDE_TO_FIT_CANVAS:
        return Math.max(
          canvas.width / this.safeZone.width,
          canvas.height / this.safeZone.height,
        );
      case ScaleMode.CHANGE_LENGTH_TO_FIT_CANVAS:
        return Math.sqrt(
          Vec2.getMagnitudeSquared({ x: canvas.width, y: canvas.height }) /
            Vec2.getMagnitudeSquared({
              x: this.safeZone.width,
              y: this.safeZone.height,
            }),
        );
    }
  }
}
