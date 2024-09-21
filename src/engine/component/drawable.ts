import { Point2 } from "@/engine/math/point";
import { Dimension2 } from "@/engine/math/dimension";
import { Component, ComponentId } from "@/engine/component";

export class Drawable implements Component {
  public static readonly id: ComponentId = ComponentId.next();

  public centered = true;
  public flipX = false;
  public flipY = false;

  constructor(
    public content: CanvasImageSource,
    public position: Point2,
    public size: Dimension2,
  ) {}
}
