export interface Point2 {
  x: number;
  y: number;
}

export namespace Point {
  export const ORIGIN: Readonly<Point2> = { x: 0, y: 0 };

  export function add(first: Point2, second: Point2): Point2 {
    return {
      x: first.x + second.x,
      y: first.y + second.y,
    };
  }

  export function subtract(first: Point2, second: Point2): Point2 {
    return {
      x: first.x - second.x,
      y: first.y - second.y,
    };
  }

  export function length(point: Point2): number {
    return Math.sqrt(point.x * point.x + point.y * point.y);
  }

  export function distance(first: Point2, second: Point2): number {
    return Math.sqrt(distanceSquared(first, second));
  }

  export function distanceSquared(first: Point2, second: Point2): number {
    const dx = first.x - second.x;
    const dy = first.y - second.y;

    return Math.pow(dx, 2) + Math.pow(dy, 2);
  }

  export function equals(
    first: Point2,
    second: Point2,
    epsilon: number = Number.EPSILON,
  ): boolean {
    return (
      Math.abs(first.x - second.x) < epsilon &&
      Math.abs(first.y - second.y) < epsilon
    );
  }

  export function isZero(
    first: Point2,
    epsilon: number = Number.EPSILON,
  ): boolean {
    return equals(first, ORIGIN, epsilon);
  }
}
