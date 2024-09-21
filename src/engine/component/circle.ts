import { Color } from "@/engine/math/color";
import { Component, ComponentId } from "@/engine/component";

export class Circle implements Component {
  public static readonly id: ComponentId = ComponentId.next();

  constructor(
    public radius: number,
    public color: Color,
  ) {}
}
