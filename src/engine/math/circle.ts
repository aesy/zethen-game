import { Vec2 } from "@/engine/math/vec2";
import { Rect, RectLike } from "@/engine/math/rect";
import { Pnt2, Pnt2Like, ReadonlyPnt2 } from "@/engine/math/pnt2";

export type CircleLike = {
  center: ReadonlyPnt2;
  radius: number;
};

export type ReadonlyCircle = Readonly<CircleLike> & {
  getClosestPoint(point: Readonly<Pnt2Like>): Pnt2;
  containsPoint(point: Readonly<Pnt2Like>): boolean;
  containsRect(rect: Readonly<RectLike>): boolean;
  containsCircle(circle: Readonly<CircleLike>): boolean;
  overlapsRect(rect: Readonly<RectLike>): boolean;
  overlapsCircle(circle: Readonly<CircleLike>): boolean;
  intersectRect(rect: Readonly<RectLike>): Rect | null;
  intersectCircle(circle: Readonly<CircleLike>): Rect | null;
  equals(other: Readonly<CircleLike>, epsilon: number): boolean;
  clone(): Circle;
  toString(): string;
};

export class Circle implements CircleLike, ReadonlyCircle {
  private readonly _center: Pnt2;

  constructor(
    x: number,
    y: number,
    public radius: number,
  ) {
    this._center = new Pnt2(x, y);
  }

  public get center(): ReadonlyPnt2 {
    return this._center;
  }

  public static from(circle: Readonly<CircleLike>): Circle {
    return new Circle(circle.center.x, circle.center.y, circle.radius);
  }

  public static getClosestPoint(
    circle: Readonly<CircleLike>,
    point: Readonly<Pnt2Like>,
  ): Pnt2 {
    const dir = Vec2.from(point)
      .subtract(circle.center)
      .normalize()
      .multiplyScalar(circle.radius);

    return Pnt2.from(circle.center).add(dir);
  }

  public static containsPoint(
    circle: Readonly<CircleLike>,
    point: Readonly<Pnt2Like>,
  ): boolean {
    const distanceSquared = circle.center.distanceToSquared(point);
    const radiusSquared = Math.pow(circle.radius, 2);

    return distanceSquared <= radiusSquared;
  }

  public static containsRect(
    circle: Readonly<CircleLike>,
    rect: Readonly<RectLike>,
  ): boolean {
    const dx = Math.max(
      circle.center.x - rect.x,
      rect.x + rect.width - circle.center.x,
    );
    const dy = Math.max(
      circle.center.y - rect.y,
      rect.y + rect.height - circle.center.y,
    );
    const distanceSquared = Math.pow(dx, 2) + Math.pow(dy, 2);
    const radiusSquared = Math.pow(circle.radius, 2);

    return distanceSquared <= radiusSquared;
  }

  public static containsCircle(
    first: Readonly<CircleLike>,
    second: Readonly<CircleLike>,
  ): boolean {
    const distanceSquared = first.center.distanceToSquared(second.center);
    const secondRadiusSquared = Math.pow(second.radius, 2);
    const firstRadiusSquared = Math.pow(first.radius, 2);

    return distanceSquared + secondRadiusSquared <= firstRadiusSquared;
  }

  public static overlapsRect(
    circle: Readonly<CircleLike>,
    rect: Readonly<RectLike>,
  ): boolean {
    return Rect.overlapsCircle(rect, circle);
  }

  public static overlapsCircle(
    first: Readonly<CircleLike>,
    second: Readonly<CircleLike>,
  ): boolean {
    const distanceSquared = first.center.distanceToSquared(second.center);
    const radiusSumSquared = Math.pow(first.radius + second.radius, 2);

    return distanceSquared <= radiusSumSquared;
  }

  public static getRectIntersectionPoints(
    circle: Readonly<CircleLike>,
    rect: Readonly<RectLike>,
  ): Pnt2[] {
    return Rect.getCircleIntersectionPoints(rect, circle);
  }

  public static getCircleIntersectionPoints(
    first: Readonly<CircleLike>,
    second: Readonly<CircleLike>,
  ): Pnt2[] {
    const dx = second.center.x - first.center.x;
    const dy = second.center.y - first.center.y;
    const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

    if (distance > first.radius + second.radius) {
      // No overlap
      return [];
    }

    if (distance < Math.abs(first.radius - second.radius)) {
      // One circle is contained within the other
      return [];
    }

    const distanceToMid =
      (Math.pow(first.radius, 2) -
        Math.pow(second.radius, 2) +
        Math.pow(distance, 2)) /
      (2 * distance);
    const mid = {
      x: first.center.x + (dx * distanceToMid) / distance,
      y: first.center.y + (dy * distanceToMid) / distance,
    };
    const distanceMidToIntersection = Math.sqrt(
      Math.pow(first.radius, 2) - Math.pow(distanceToMid, 2),
    );
    const offset = {
      x: -dy * (distanceMidToIntersection / distance),
      y: dx * (distanceMidToIntersection / distance),
    };

    return [Pnt2.from(mid).add(offset), Pnt2.from(mid).subtract(offset)];
  }

  public static intersectRect(
    circle: Readonly<CircleLike>,
    rect: Readonly<RectLike>,
  ): Rect | null {
    return Rect.intersectCircle(rect, circle);
  }

  public static intersectCircle(
    first: Readonly<CircleLike>,
    second: Readonly<CircleLike>,
  ): Rect | null {
    if (Circle.overlapsCircle(first, second)) {
      // TODO not accurate
      return Rect.intersectRect(
        Circle.getBoundingRect(first),
        Circle.getBoundingRect(second),
      );
    }

    if (Circle.containsCircle(first, second)) {
      return Circle.getBoundingRect(second);
    }

    if (Circle.containsCircle(second, first)) {
      return Circle.getBoundingRect(first);
    }

    return null;
  }

  public static getBoundingRect(circle: Readonly<CircleLike>): Rect {
    const diameter = circle.radius * 2;

    return new Rect(
      circle.center.x - circle.radius,
      circle.center.y - circle.radius,
      diameter,
      diameter,
    );
  }

  public static equals(
    first: Readonly<CircleLike>,
    second: Readonly<CircleLike>,
    epsilon = Number.EPSILON,
  ): boolean {
    return (
      Math.abs(first.center.x - second.center.x) < epsilon &&
      Math.abs(first.center.y - second.center.y) < epsilon &&
      Math.abs(first.radius - second.radius) < epsilon
    );
  }

  public getClosestPoint(point: Readonly<Pnt2Like>): Pnt2 {
    return Circle.getClosestPoint(this, point);
  }

  public containsPoint(point: Readonly<Pnt2Like>): boolean {
    return Circle.containsPoint(this, point);
  }

  public containsRect(rect: Readonly<RectLike>): boolean {
    return Circle.containsRect(this, rect);
  }

  public containsCircle(circle: Readonly<CircleLike>): boolean {
    return Circle.containsCircle(this, circle);
  }

  public overlapsRect(rect: Readonly<RectLike>): boolean {
    return Circle.overlapsRect(this, rect);
  }

  public overlapsCircle(circle: Readonly<CircleLike>): boolean {
    return Circle.overlapsCircle(this, circle);
  }

  public getRectIntersectionPoints(rect: Readonly<RectLike>): Pnt2[] {
    return Circle.getRectIntersectionPoints(this, rect);
  }

  public getCircleIntersectionPoints(circle: Readonly<CircleLike>): Pnt2[] {
    return Circle.getCircleIntersectionPoints(this, circle);
  }

  public intersectRect(rect: Readonly<RectLike>): Rect | null {
    return Circle.intersectRect(this, rect);
  }

  public intersectCircle(circle: Readonly<CircleLike>): Rect | null {
    return Circle.intersectCircle(this, circle);
  }

  public getBoundingRect(): Rect {
    return Circle.getBoundingRect(this);
  }

  public equals(
    other: Readonly<CircleLike>,
    epsilon = Number.EPSILON,
  ): boolean {
    return Circle.equals(this, other, epsilon);
  }

  public copy(other: Readonly<CircleLike>): this {
    this._center.x = other.center.x;
    this._center.y = other.center.y;
    this.radius = other.radius;
    return this;
  }

  public clone(): Circle {
    return new Circle(this.center.x, this.center.y, this.radius);
  }

  public toString(): string {
    const x = this.center.x.toFixed(1);
    const y = this.center.y.toFixed(1);
    const radius = this.radius.toFixed(1);

    return `Circle(x:${x}, y:${y}, r:${radius})`;
  }
}
