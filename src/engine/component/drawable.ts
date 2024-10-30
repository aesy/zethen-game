import { Pnt2 } from "@/engine/math/pnt2";
import { Dim2 } from "@/engine/math/dim2";
import { Component, ComponentId } from "@/engine/component";

export class Drawable implements Component {
  public static readonly id: ComponentId = ComponentId.next();

  public centered = true;
  public flipX = false;
  public flipY = false;

  constructor(
    public content: CanvasImageSource,
    public position: Pnt2,
    public size: Dim2,
  ) {}
}
