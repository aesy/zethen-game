import { clamp } from "@/engine/util/math";
import { Pnt2, Pnt2Like, ReadonlyPnt2 } from "@/engine/math/pnt2";
import { Line2, Line2Like, ReadonlyLine2 } from "@/engine/math/line2";
import { Circle, CircleLike } from "@/engine/math/circle";

// TODO translate, rotate, scale, transform

export type RectLike = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ReadonlyRect = Readonly<RectLike> & {
  left: number;
  right: number;
  top: number;
  bottom: number;
  center: ReadonlyPnt2;
  topLeft: ReadonlyPnt2;
  topRight: ReadonlyPnt2;
  bottomLeft: ReadonlyPnt2;
  bottomRight: ReadonlyPnt2;
  corners: [ReadonlyPnt2, ReadonlyPnt2, ReadonlyPnt2, ReadonlyPnt2];
  edges: [ReadonlyLine2, ReadonlyLine2, ReadonlyLine2, ReadonlyLine2];
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
  equals(other: Readonly<RectLike>, epsilon: number): boolean;
  clone(): Rect;
  toString(): string;
};

export class Rect implements RectLike, ReadonlyRect {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
  ) {}

  public get center(): Pnt2 {
    return Rect.getCenter(this);
  }

  public get left(): number {
    return Rect.getLeft(this);
  }

  public get right(): number {
    return Rect.getRight(this);
  }

  public get top(): number {
    return Rect.getTop(this);
  }

  public get bottom(): number {
    return Rect.getBottom(this);
  }

  public get topLeft(): Pnt2 {
    return Rect.getTopLeft(this);
  }

  public get topRight(): Pnt2 {
    return Rect.getTopRight(this);
  }

  public get bottomLeft(): Pnt2 {
    return Rect.getBottomLeft(this);
  }

  public get bottomRight(): Pnt2 {
    return Rect.getBottomRight(this);
  }

  public get corners(): [Pnt2, Pnt2, Pnt2, Pnt2] {
    return Rect.getCorners(this);
  }

  public get edges(): [Line2, Line2, Line2, Line2] {
    return Rect.getEdges(this);
  }

  public static from(rect: Readonly<RectLike>): Rect {
    return new Rect(rect.x, rect.y, rect.width, rect.height);
  }

  public getClosestPoint(point: Readonly<Pnt2Like>): Pnt2 {
    return Rect.getClosestPoint(this, point);
  }

  public containsPoint(point: Readonly<Pnt2Like>): boolean {
    return Rect.containsPoint(this, point);
  }

  public containsRect(rect: Readonly<RectLike>): boolean {
    return Rect.containsRect(this, rect);
  }

  public containsCircle(circle: Readonly<CircleLike>): boolean {
    return Rect.containsCircle(this, circle);
  }

  public containsLine(line: Readonly<Line2Like>): boolean {
    return Rect.containsLine(this, line);
  }

  public overlapsRect(rect: Readonly<RectLike>): boolean {
    return Rect.overlapsRect(this, rect);
  }

  public overlapsCircle(circle: Readonly<CircleLike>): boolean {
    return Rect.overlapsCircle(this, circle);
  }

  public overlapsLine(line: Readonly<Line2Like>): boolean {
    return Rect.overlapsLine(this, line);
  }

  public intersectRect(rect: Readonly<RectLike>): Rect | null {
    return Rect.intersectRect(this, rect);
  }

  public intersectCircle(circle: Readonly<CircleLike>): Rect | null {
    return Rect.intersectCircle(this, circle);
  }

  public getRectIntersectionPoints(rect: Readonly<RectLike>): Pnt2[] {
    return Rect.getRectIntersectionPoints(this, rect);
  }

  public getCircleIntersectionPoints(circle: Readonly<CircleLike>): Pnt2[] {
    return Rect.getCircleIntersectionPoints(this, circle);
  }

  public getLineIntersectionPoints(line: Readonly<Line2Like>): Pnt2[] {
    return Rect.getLineIntersectionPoints(this, line);
  }

  public getBoundingRect(): Rect {
    return Rect.getBoundingRect(this);
  }

  public equals(other: Readonly<RectLike>, epsilon = Number.EPSILON): boolean {
    return Rect.equals(this, other, epsilon);
  }

  public copy(other: Readonly<RectLike>): this {
    this.x = other.x;
    this.y = other.y;
    this.width = other.width;
    this.height = other.height;

    return this;
  }

  public clone(): Rect {
    return new Rect(this.x, this.y, this.width, this.height);
  }

  public toString(): string {
    const x = this.x.toFixed(1);
    const y = this.y.toFixed(1);
    const width = this.width.toFixed(1);
    const height = this.height.toFixed(1);

    return `Rect(x:${x}, y:${y}, w:${width}, h:${height})`;
  }
}

export namespace Rect {
  export function getCenter(rect: Readonly<RectLike>): Pnt2 {
    return new Pnt2(rect.x + rect.width / 2, rect.y + rect.height / 2);
  }

  export function getLeft(rect: Readonly<RectLike>): number {
    return rect.x;
  }

  export function getRight(rect: Readonly<RectLike>): number {
    return rect.x + rect.width;
  }

  export function getTop(rect: Readonly<RectLike>): number {
    return rect.y;
  }

  export function getBottom(rect: Readonly<RectLike>): number {
    return rect.y + rect.height;
  }

  export function getTopLeft(rect: Readonly<RectLike>): Pnt2 {
    return new Pnt2(rect.x, rect.y);
  }

  export function getTopRight(rect: Readonly<RectLike>): Pnt2 {
    return new Pnt2(rect.x + rect.width, rect.y);
  }

  export function getBottomLeft(rect: Readonly<RectLike>): Pnt2 {
    return new Pnt2(rect.x, rect.y + rect.height);
  }

  export function getBottomRight(rect: Readonly<RectLike>): Pnt2 {
    return new Pnt2(rect.x + rect.width, rect.y + rect.height);
  }

  export function getCorners(
    rect: Readonly<RectLike>,
  ): [Pnt2, Pnt2, Pnt2, Pnt2] {
    return [
      Rect.getTopLeft(rect),
      Rect.getTopRight(rect),
      Rect.getBottomRight(rect),
      Rect.getBottomLeft(rect),
    ];
  }

  export function getEdges(
    rect: Readonly<RectLike>,
  ): [Line2, Line2, Line2, Line2] {
    const corners = Rect.getCorners(rect);

    return [
      new Line2(corners[0], corners[1]),
      new Line2(corners[1], corners[2]),
      new Line2(corners[2], corners[3]),
      new Line2(corners[3], corners[0]),
    ];
  }

  export function getClosestPoint(
    rect: Readonly<RectLike>,
    point: Readonly<Pnt2Like>,
  ): Pnt2 {
    const result = Pnt2.from(point);
    const left = rect.x;
    const top = rect.y;
    const right = left + rect.width;
    const bottom = top + rect.height;

    if (Rect.containsPoint(rect, point)) {
      const distanceLeft = left - result.x;
      const distanceTop = top - result.y;
      const distanceRight = right - result.x;
      const distanceBottom = bottom - result.y;
      const xMin = Math.min(distanceLeft, distanceRight);
      const yMin = Math.min(distanceTop, distanceBottom);
      const distanceMin = Math.min(xMin, yMin);

      if (distanceMin === distanceLeft) {
        result.x = left;
      } else if (distanceMin === distanceRight) {
        result.x = right;
      }

      if (distanceMin === distanceTop) {
        result.y = top;
      } else if (distanceMin === distanceBottom) {
        result.y = bottom;
      }

      return result;
    }

    result.x = clamp(point.x, { min: left, max: right });
    result.y = clamp(point.y, { min: top, max: bottom });

    return result;
  }

  export function containsPoint(
    rect: Readonly<RectLike>,
    point: Readonly<Pnt2Like>,
  ): boolean {
    return (
      rect.x <= point.x &&
      rect.x + rect.width >= point.x &&
      rect.y <= point.y &&
      rect.y + rect.height >= point.y
    );
  }

  export function containsRect(
    first: Readonly<RectLike>,
    second: Readonly<RectLike>,
  ): boolean {
    return (
      first.x <= second.x &&
      first.x + first.width >= second.x + second.width &&
      first.y <= second.y &&
      first.y + first.height >= second.y + second.height
    );
  }

  export function containsCircle(
    rect: Readonly<RectLike>,
    circle: Readonly<CircleLike>,
  ): boolean {
    if (!Rect.containsPoint(rect, circle)) {
      return false;
    }

    const closestPoint = Rect.getClosestPoint(rect, circle);
    const distanceSquared = closestPoint.distanceToSquared(circle);
    const radiusSquared = Math.pow(circle.radius, 2);

    return radiusSquared <= distanceSquared;
  }

  export function containsLine(
    rect: Readonly<RectLike>,
    line: Readonly<Line2Like>,
  ): boolean {
    return (
      Rect.containsPoint(rect, line.start) && Rect.containsPoint(rect, line.end)
    );
  }

  export function overlapsRect(
    first: Readonly<RectLike>,
    second: Readonly<RectLike>,
  ): boolean {
    return (
      first.x + first.width >= second.x &&
      first.x <= second.x + second.width &&
      first.y + first.height >= second.y &&
      first.y <= second.y + second.height
    );
  }

  export function overlapsCircle(
    rect: Readonly<RectLike>,
    circle: Readonly<CircleLike>,
  ): boolean {
    if (Rect.containsPoint(rect, circle)) {
      return true;
    }

    const closestPoint = Rect.getClosestPoint(rect, circle);

    return Circle.containsPoint(circle, closestPoint);
  }

  export function overlapsLine(
    rect: Readonly<RectLike>,
    line: Readonly<Line2Like>,
  ): boolean {
    return (
      Rect.containsLine(rect, line) ||
      Rect.getEdges(rect).some((e) => Rect.getLineIntersectionPoints(rect, e))
    );
  }

  export function intersectCircle(
    rect: Readonly<RectLike>,
    circle: Readonly<CircleLike>,
  ): Rect | null {
    // TODO not accurate
    return Rect.intersectRect(rect, Circle.getBoundingRect(circle));
  }

  export function intersectRect(
    first: Readonly<RectLike>,
    second: Readonly<RectLike>,
  ): Rect | null {
    const xMin = Math.max(first.x, second.x);
    const xMax = Math.min(first.x + first.width, second.x + second.width);
    const yMin = Math.max(first.y, second.y);
    const yMax = Math.min(first.y + first.height, second.y + second.height);
    const width = xMax - xMin;
    const height = yMax - yMin;

    if (width <= 0 || height <= 0) {
      return null;
    }

    return new Rect(xMin, yMin, width, height);
  }

  export function getRectIntersectionPoints(
    first: Readonly<RectLike>,
    second: Readonly<RectLike>,
  ): Pnt2[] {
    if (!Rect.overlapsRect(first, second)) {
      return [];
    }

    const edges1 = Rect.getEdges(first);
    const edges2 = Rect.getEdges(second);
    const intersections: Pnt2[] = [];

    for (const edge1 of edges1) {
      for (const edge2 of edges2) {
        const intersectionPoints = Line2.getLineIntersectionPoints(
          edge1,
          edge2,
        );

        if (intersectionPoints.length > 0) {
          intersections.push(...intersectionPoints);
        }
      }
    }

    return intersections;
  }

  export function getCircleIntersectionPoints(
    rect: Readonly<RectLike>,
    circle: Readonly<CircleLike>,
  ): Pnt2[] {
    const edges = Rect.getEdges(rect);
    const intersections: Pnt2[] = [];

    for (const edge of edges) {
      const intersection = Line2.getCircleIntersectionPoints(edge, circle);

      if (intersection) {
        intersections.push(...intersection);
      }
    }

    return intersections;
  }

  export function getLineIntersectionPoints(
    rect: Readonly<RectLike>,
    line: Readonly<Line2Like>,
  ): Pnt2[] {
    // TODO
    throw new Error("Not implemented");
  }

  export function getBoundingRect(rect: Readonly<RectLike>): Rect {
    return Rect.from(rect);
  }

  export function equals(
    first: Readonly<RectLike>,
    second: Readonly<RectLike>,
    epsilon = Number.EPSILON,
  ): boolean {
    return (
      Math.abs(first.x - second.x) < epsilon &&
      Math.abs(first.y - second.y) < epsilon &&
      Math.abs(first.x + first.width - second.x + second.width) < epsilon &&
      Math.abs(first.y + first.height - second.y + second.height) < epsilon
    );
  }
}
