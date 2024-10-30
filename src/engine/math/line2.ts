import { Pnt2, Pnt2Like } from "@/engine/math/pnt2";
import { CircleLike } from "@/engine/math/circle";

export type Line2Like = {
  start: Pnt2Like;
  end: Pnt2Like;
};

export type ReadonlyLine2 = Readonly<Line2Like> & {
  // TODO getClosestPoint(point: Readonly<Pnt2Like>): Pnt2;
  // TODO intersectRect(rect: Readonly<RectLike>): Pnt2 | null;
  intersectCircle(circle: Readonly<CircleLike>): Pnt2[] | null;
  intersectLine(line: Readonly<Line2Like>): Pnt2 | null;
  equals(other: Readonly<Line2Like>, epsilon: number): boolean;
  clone(): Line2;
  toString(): string;
};

export class Line2 implements Line2Like, ReadonlyLine2 {
  constructor(
    public start: Pnt2Like,
    public end: Pnt2Like,
  ) {}

  public static from(line: Readonly<Line2Like>): Line2 {
    return new Line2(Pnt2.from(line.start), Pnt2.from(line.end));
  }

  public static intersectCircle(
    line: Readonly<Line2Like>,
    circle: Readonly<CircleLike>,
  ): Pnt2[] | null {
    const dx = line.end.x - line.start.x;
    const dy = line.end.y - line.start.y;
    const fx = line.start.x - circle.center.x;
    const fy = line.start.y - circle.center.y;

    const a = dx * dx + dy * dy;
    const b = 2 * (fx * dx + fy * dy);
    const c = fx * fx + fy * fy - circle.radius * circle.radius;

    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0) {
      return null;
    }

    const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    const intersectionPoints: Pnt2[] = [];

    if (t1 >= 0 && t1 <= 1) {
      intersectionPoints.push(
        Pnt2.from({ x: line.start.x + t1 * dx, y: line.start.y + t1 * dy }),
      );
    }

    if (t2 >= 0 && t2 <= 1) {
      intersectionPoints.push(
        Pnt2.from({ x: line.start.x + t2 * dx, y: line.start.y + t2 * dy }),
      );
    }

    return intersectionPoints;
  }

  public static intersectLine(
    first: Readonly<Line2Like>,
    second: Readonly<Line2Like>,
  ): Pnt2 | null {
    const denom =
      (second.end.y - second.start.y) * (first.end.x - first.start.x) -
      (second.end.x - second.start.x) * (first.end.y - first.start.y);

    if (denom === 0) {
      // Lines are parallel or coincident
      return null;
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
      return null;
    }

    return Pnt2.from({
      x: first.start.x + ua * (first.end.x - first.start.x),
      y: first.start.y + ua * (first.end.y - first.start.y),
    });
  }

  public static equals(
    first: Readonly<Line2Like>,
    second: Readonly<Line2Like>,
    epsilon = Number.EPSILON,
  ): boolean {
    return (
      Pnt2.equals(first.start, second.start, epsilon) &&
      Pnt2.equals(first.end, second.end, epsilon)
    );
  }

  public intersectCircle(circle: Readonly<CircleLike>): Pnt2[] | null {
    return Line2.intersectCircle(this, circle);
  }

  public intersectLine(line: Readonly<Line2Like>): Pnt2 | null {
    return Line2.intersectLine(this, line);
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
    const startX = this.start.x.toFixed(1);
    const startY = this.start.y.toFixed(1);
    const endX = this.end.x.toFixed(1);
    const endY = this.end.y.toFixed(1);

    return `Line2(startX:${startX}, startY:${startY}, endX:${endX}, endY:${endY})`;
  }
}
