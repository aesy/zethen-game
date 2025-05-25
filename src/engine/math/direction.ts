import { Vec3 } from "@/engine/math/vec3";

export namespace Direction {
  export const DOWN = new Vec3(0, -1, 0);
  export const UP = new Vec3(0, 1, 0);
  export const LEFT = new Vec3(-1, 0, 0);
  export const RIGHT = new Vec3(1, 0, 0);
  export const BACKWARD = new Vec3(0, 0, 1);
  export const FORWARD = new Vec3(0, 0, 1);

  const ALL = [DOWN, UP, LEFT, RIGHT, BACKWARD, FORWARD];

  export function all(): ReadonlyArray<Vec3> {
    return ALL;
  }
}
