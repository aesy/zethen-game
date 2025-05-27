import { Vec2, Vec2Like } from "@/engine/math/vec2";
import { Rect, RectLike } from "@/engine/math/rect";
import { Pnt2, Pnt2Like, ReadonlyPnt2 } from "@/engine/math/pnt2";
import { Mat3x3Like } from "@/engine/math/mat3x3";
import { Line2Like } from "@/engine/math/line2";

export type CircleLike = {
  x: number;
  y: number;
  radius: number;
};

export type ReadonlyCircle = Readonly<CircleLike> & {
  readonly center: ReadonlyPnt2;
  getClosestPoint(point: Readonly<Pnt2Like>): Pnt2;
  containsPoint(point: Readonly<Pnt2Like>): boolean;
  containsRect(rect: Readonly<RectLike>): boolean;
  containsCircle(circle: Readonly<CircleLike>): boolean;
  containsLine(line: Readonly<Line2Like>): boolean;
  overlapsRect(rect: Readonly<RectLike>): boolean;
  overlapsCircle(circle: Readonly<CircleLike>): boolean;
  overlapsLine(line: Readonly<Line2Like>): boolean;
  intersectRect(rect: Readonly<RectLike>): Rect | null;
  intersectCircle(circle: Readonly<CircleLike>): Rect | null;
  getRectIntersectionPoints(rect: Readonly<RectLike>): Pnt2[];
  getCircleIntersectionPoints(circle: Readonly<CircleLike>): Pnt2[];
  getLineIntersectionPoints(line: Readonly<Line2Like>): Pnt2[];
  getBoundingRect(): Rect;
  equals(other: Readonly<CircleLike>, epsilon: number): boolean;
  clone(): Circle;
  toString(): string;
};

export class Circle implements CircleLike, ReadonlyCircle {
  constructor(
    public x: number,
    public y: number,
    public radius: number,
  ) {}

  public get center(): Pnt2 {
    return new Pnt2(this.x, this.y);
  }

  public static from(circle: Readonly<CircleLike>): Circle {
    return new Circle(circle.x, circle.y, circle.radius);
  }

  public translate(vec: Readonly<Vec2Like>): this {
    this.x += vec.x;
    this.y += vec.y;

    return this;
  }

  public rotate(radians: number): this {
    // Do nothing lol
    return this;
  }

  public scale(scale: number): this {
    this.radius *= scale;

    return this;
  }

  public transform(mat: Readonly<Mat3x3Like>): this {
    const center = Vec2.transformMat3(this, mat);
    const radius = Vec2.transformMat3({ x: this.radius, y: 0 }, mat).x;

    this.x = center.x;
    this.y = center.y;
    this.radius = Math.abs(center.x - radius);

    return this;
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

  public containsLine(line: Readonly<Line2Like>): boolean {
    return Circle.containsLine(this, line);
  }

  public overlapsRect(rect: Readonly<RectLike>): boolean {
    return Circle.overlapsRect(this, rect);
  }

  public overlapsCircle(circle: Readonly<CircleLike>): boolean {
    return Circle.overlapsCircle(this, circle);
  }

  public overlapsLine(line: Readonly<Line2Like>): boolean {
    return Circle.overlapsLine(this, line);
  }

  public intersectRect(rect: Readonly<RectLike>): Rect | null {
    return Circle.intersectRect(this, rect);
  }

  public intersectCircle(circle: Readonly<CircleLike>): Rect | null {
    return Circle.intersectCircle(this, circle);
  }

  public getRectIntersectionPoints(rect: Readonly<RectLike>): Pnt2[] {
    return Circle.getRectIntersectionPoints(this, rect);
  }

  public getCircleIntersectionPoints(circle: Readonly<CircleLike>): Pnt2[] {
    return Circle.getCircleIntersectionPoints(this, circle);
  }

  public getLineIntersectionPoints(line: Readonly<Line2Like>): Pnt2[] {
    return Circle.getLineIntersectionPoints(this, line);
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
    this.x = other.x;
    this.y = other.y;
    this.radius = other.radius;
    return this;
  }

  public clone(): Circle {
    return new Circle(this.x, this.y, this.radius);
  }

  public toString(): string {
    const x = this.x.toFixed(1);
    const y = this.y.toFixed(1);
    const radius = this.radius.toFixed(1);

    return `Circle(x:${x}, y:${y}, r:${radius})`;
  }
}

export namespace Circle {
  export function getClosestPoint(
    circle: Readonly<CircleLike>,
    point: Readonly<Pnt2Like>,
  ): Pnt2 {
    const dir = Vec2.direction(point, circle)
      .normalize()
      .multiplyScalar(circle.radius);

    return Pnt2.from(circle).add(dir);
  }

  export function containsPoint(
    circle: Readonly<CircleLike>,
    point: Readonly<Pnt2Like>,
  ): boolean {
    const distanceSquared = Pnt2.distanceBetweenSquared(circle, point);
    const radiusSquared = Math.pow(circle.radius, 2);

    return distanceSquared <= radiusSquared;
  }

  export function containsRect(
    circle: Readonly<CircleLike>,
    rect: Readonly<RectLike>,
  ): boolean {
    const dx = Math.max(circle.x - rect.x, rect.x + rect.width - circle.x);
    const dy = Math.max(circle.y - rect.y, rect.y + rect.height - circle.y);
    const distanceSquared = Math.pow(dx, 2) + Math.pow(dy, 2);
    const radiusSquared = Math.pow(circle.radius, 2);

    return distanceSquared <= radiusSquared;
  }

  export function containsCircle(
    first: Readonly<CircleLike>,
    second: Readonly<CircleLike>,
  ): boolean {
    const distanceSquared = Pnt2.distanceBetweenSquared(first, second);
    const secondRadiusSquared = Math.pow(second.radius, 2);
    const firstRadiusSquared = Math.pow(first.radius, 2);

    return distanceSquared + secondRadiusSquared <= firstRadiusSquared;
  }

  export function containsLine(
    circle: Readonly<CircleLike>,
    line: Readonly<Line2Like>,
  ): boolean {
    return (
      Circle.containsPoint(circle, line.start) &&
      Circle.containsPoint(circle, line.end)
    );
  }

  export function overlapsRect(
    circle: Readonly<CircleLike>,
    rect: Readonly<RectLike>,
  ): boolean {
    return Rect.overlapsCircle(rect, circle);
  }

  export function overlapsCircle(
    first: Readonly<CircleLike>,
    second: Readonly<CircleLike>,
  ): boolean {
    const distanceSquared = Pnt2.distanceBetweenSquared(first, second);
    const radiusSumSquared = Math.pow(first.radius + second.radius, 2);

    return distanceSquared <= radiusSumSquared;
  }

  export function overlapsLine(
    circle: Readonly<CircleLike>,
    line: Readonly<Line2Like>,
  ): boolean {
    const dx = line.end.x - line.start.x;
    const dy = line.end.y - line.start.y;
    const fx = line.start.x - circle.x;
    const fy = line.start.y - circle.y;
    const a = dx * dx + dy * dy;
    const b = 2 * (fx * dx + fy * dy);
    const c = fx * fx + fy * fy - circle.radius * circle.radius;
    const discriminant = b * b - 4 * a * c;

    return discriminant >= 0;
  }

  export function intersectRect(
    circle: Readonly<CircleLike>,
    rect: Readonly<RectLike>,
  ): Rect | null {
    return Rect.intersectRect(rect, Circle.getBoundingRect(circle));
  }

  export function intersectCircle(
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

  export function getRectIntersectionPoints(
    circle: Readonly<CircleLike>,
    rect: Readonly<RectLike>,
  ): Pnt2[] {
    return Rect.getCircleIntersectionPoints(rect, circle);
  }

  export function getCircleIntersectionPoints(
    first: Readonly<CircleLike>,
    second: Readonly<CircleLike>,
  ): Pnt2[] {
    const dx = second.x - first.x;
    const dy = second.y - first.y;
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
      x: first.x + (dx * distanceToMid) / distance,
      y: first.y + (dy * distanceToMid) / distance,
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

  export function getLineIntersectionPoints(
    circle: Readonly<CircleLike>,
    line: Readonly<Line2Like>,
  ): Pnt2[] {
    const dx = line.end.x - line.start.x;
    const dy = line.end.y - line.start.y;
    const fx = line.start.x - circle.x;
    const fy = line.start.y - circle.y;
    const a = dx * dx + dy * dy;
    const b = 2 * (fx * dx + fy * dy);
    const c = fx * fx + fy * fy - circle.radius * circle.radius;
    const discriminant = b * b - 4 * a * c;

    if (discriminant < 0) {
      return [];
    }

    const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    const intersectionPoints: Pnt2[] = [];

    if (t1 >= 0 && t1 <= 1) {
      intersectionPoints.push(
        new Pnt2(line.start.x + t1 * dx, line.start.y + t1 * dy),
      );
    }

    if (t2 >= 0 && t2 <= 1) {
      intersectionPoints.push(
        new Pnt2(line.start.x + t2 * dx, line.start.y + t2 * dy),
      );
    }

    return intersectionPoints;
  }

  export function getBoundingRect(circle: Readonly<CircleLike>): Rect {
    const diameter = circle.radius * 2;

    return new Rect(
      circle.x - circle.radius,
      circle.y - circle.radius,
      diameter,
      diameter,
    );
  }

  export function equals(
    first: Readonly<CircleLike>,
    second: Readonly<CircleLike>,
    epsilon = Number.EPSILON,
  ): boolean {
    return (
      Math.abs(first.x - second.x) < epsilon &&
      Math.abs(first.y - second.y) < epsilon &&
      Math.abs(first.radius - second.radius) < epsilon
    );
  }
}
