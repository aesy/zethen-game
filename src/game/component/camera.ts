import { Vec2Like } from "@/engine/math/vec2";
import { Component, ComponentId } from "@/engine/ecs/component";

export class Camera implements Component {
  public static readonly id: ComponentId = ComponentId.next();

  public translate(point: Readonly<Vec2Like>): void {
    // TODO
  }

  public zoom(zoomLevel: number): void {
    // TODO
  }

  public rotate(radians: number): void {
    // TODO
  }
}
