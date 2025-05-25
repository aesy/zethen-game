import { RecursiveReadonly } from "@/engine/util/type";
import { clamp } from "@/engine/util/math";
import { Vec2 } from "@/engine/math/vec2";
import { Rect, RectLike } from "@/engine/math/rect";
import { Pnt2, Pnt2Like } from "@/engine/math/pnt2";
import { Circle, CircleLike } from "@/engine/math/circle";

// TODO translate, rotate, scale, transform

export type Line2Like = {
  readonly start: Pnt2Like;
  readonly end: Pnt2Like;
};

export type ReadonlyLine2 = RecursiveReadonly<Line2Like> & {
  getClosestPoint(point: Readonly<Pnt2Like>): Pnt2;
  overlapsRect(rect: Readonly<RectLike>): boolean;
  overlapsCircle(circle: Readonly<CircleLike>): boolean;
  overlapsLine(line: Readonly<Line2Like>): boolean;
  getRectIntersectionPoints(rect: Readonly<RectLike>): Pnt2[];
  getCircleIntersectionPoints(circle: Readonly<CircleLike>): Pnt2[];
  getLineIntersectionPoints(line: Readonly<Line2Like>): Pnt2[];
  getBoundingRect(): Rect;
  equals(other: Readonly<Line2Like>, epsilon: number): boolean;
  clone(): Line2;
  toString(): string;
};

export class Line2 implements Line2Like, ReadonlyLine2 {
  constructor(
    public readonly start: Pnt2Like,
    public readonly end: Pnt2Like,
  ) {}

  public static from(line: Readonly<Line2Like>): Line2 {
    return new Line2(Pnt2.from(line.start), Pnt2.from(line.end));
  }

  public getClosestPoint(point: Readonly<Pnt2Like>): Pnt2 {
    return Line2.getClosestPoint(this, point);
  }

  public overlapsRect(rect: Readonly<RectLike>): boolean {
    return Line2.overlapsRect(this, rect);
  }

  public overlapsCircle(circle: Readonly<CircleLike>): boolean {
    return Line2.overlapsCircle(this, circle);
  }

  public overlapsLine(line: Readonly<Line2Like>): boolean {
    return Line2.overlapsLine(this, line);
  }

  public getRectIntersectionPoints(rect: Readonly<RectLike>): Pnt2[] {
    return Line2.getRectIntersectionPoints(this, rect);
  }

  public getCircleIntersectionPoints(circle: Readonly<CircleLike>): Pnt2[] {
    return Line2.getCircleIntersectionPoints(this, circle);
  }

  public getLineIntersectionPoints(line: Readonly<Line2Like>): Pnt2[] {
    return Line2.getLineIntersectionPoints(this, line);
  }

  public getBoundingRect(): Rect {
    return Line2.getBoundingRect(this);
  }

  public equals(other: Readonly<Line2Like>, epsilon = Number.EPSILON): boolean {
    return Line2.equals(this, other, epsilon);
  }

  public copy(other: Readonly<Line2Like>): this {
    this.start.x = other.start.x;
    this.start.y = other.start.y;
    this.end.x = other.end.x;
    this.end.y = other.end.y;
    return this;
  }

  public clone(): Line2 {
    return new Line2(this.start, this.end);
  }

  public toString(): string {
    const sx = this.start.x.toFixed(1);
    const sy = this.start.y.toFixed(1);
    const ex = this.end.x.toFixed(1);
    const ey = this.end.y.toFixed(1);

    return `Line2(sx:${sx}, sy:${sy}, ex:${ex}, ey:${ey})`;
  }
}

export namespace Line2 {
  export function getClosestPoint(
    line: Readonly<Line2Like>,
    point: Readonly<Pnt2Like>,
  ): Pnt2 {
    const lVec = Vec2.direction(line.start, line.end);
    const pVec = Vec2.direction(line.start, point);
    const len = lVec.magnitudeSquared;

    if (len === 0) {
      // Line is a point
      return Pnt2.from(line.start);
    }

    const projection = Vec2.dot(pVec, lVec) / len;
    const clamped = clamp(projection, { min: 0, max: 1 });

    return new Pnt2(
      line.start.x + clamped * lVec.x,
      line.start.y + clamped * lVec.y,
    );
  }

  export function overlapsRect(
    line: Readonly<Line2Like>,
    rect: Readonly<RectLike>,
  ): boolean {
    return Rect.overlapsLine(rect, line);
  }

  export function overlapsCircle(
    line: Readonly<Line2Like>,
    circle: Readonly<CircleLike>,
  ): boolean {
    return Circle.overlapsLine(circle, line);
  }

  export function overlapsLine(
    first: Readonly<Line2Like>,
    second: Readonly<Line2Like>,
  ): boolean {
    const denom =
      (second.end.y - second.start.y) * (first.end.x - first.start.x) -
      (second.end.x - second.start.x) * (first.end.y - first.start.y);

    if (denom === 0) {
      return false;
    }

    const ua =
      ((second.end.x - second.start.x) * (first.start.y - second.start.y) -
        (second.end.y - second.start.y) * (first.start.x - second.start.x)) /
      denom;
    const ub =
      ((first.end.x - first.start.x) * (first.start.y - second.start.y) -
        (first.end.y - first.start.y) * (first.start.x - second.start.x)) /
      denom;

    return !(ua < 0 || ua > 1 || ub < 0 || ub > 1);
  }

  export function getRectIntersectionPoints(
    line: Readonly<Line2Like>,
    rect: Readonly<RectLike>,
  ): Pnt2[] {
    return Rect.getLineIntersectionPoints(rect, line);
  }

  export function getCircleIntersectionPoints(
    line: Readonly<Line2Like>,
    circle: Readonly<CircleLike>,
  ): Pnt2[] {
    return Circle.getLineIntersectionPoints(circle, line);
  }

  export function getLineIntersectionPoints(
    first: Readonly<Line2Like>,
    second: Readonly<Line2Like>,
  ): Pnt2[] {
    const denom =
      (second.end.y - second.start.y) * (first.end.x - first.start.x) -
      (second.end.x - second.start.x) * (first.end.y - first.start.y);

    if (denom === 0) {
      // Lines are parallel or coincident
      return [];
    }

    const ua =
      ((second.end.x - second.start.x) * (first.start.y - second.start.y) -
        (second.end.y - second.start.y) * (first.start.x - second.start.x)) /
      denom;
    const ub =
      ((first.end.x - first.start.x) * (first.start.y - second.start.y) -
        (first.end.y - first.start.y) * (first.start.x - second.start.x)) /
      denom;

    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
      // Intersection point is not within the segments
      return [];
    }

    return [
      new Pnt2(
        first.start.x + ua * (first.end.x - first.start.x),
        first.start.y + ua * (first.end.y - first.start.y),
      ),
    ];
  }

  export function getBoundingRect(line: Readonly<Line2Like>): Rect {
    const xMin = Math.min(line.start.x, line.end.x);
    const xMax = Math.max(line.start.x, line.end.x);
    const yMin = Math.min(line.start.y, line.end.y);
    const yMax = Math.max(line.start.y, line.end.y);
    const width = xMax - xMin;
    const height = yMax - yMin;

    return new Rect(xMax, yMax, width, height);
  }

  export function equals(
    first: Readonly<Line2Like>,
    second: Readonly<Line2Like>,
    epsilon = Number.EPSILON,
  ): boolean {
    return (
      Math.abs(first.start.x - second.start.x) < epsilon &&
      Math.abs(first.start.y - second.start.y) < epsilon &&
      Math.abs(first.end.x - second.end.x) < epsilon &&
      Math.abs(first.end.y - second.end.y) < epsilon
    );
  }
}
