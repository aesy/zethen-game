import { Dimension2 } from "@/engine/math/dimension";
import { Color } from "@/engine/math/color";
import { Component, ComponentId } from "@/engine/component";

export class Rectangle implements Component {
  public static readonly id: ComponentId = ComponentId.next();

  constructor(
    public size: Dimension2,
    public color: Color,
  ) {}
}
