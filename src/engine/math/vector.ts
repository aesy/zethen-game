import { Point2, Point } from "@/engine/math/point";

export class Vector2 {
  constructor(
    public x: number,
    public y: number,
  ) {}

  public static identity(): Vector2 {
    return new Vector2(1, 1);
  }

  static fromAngle(angle: number, magnitude = 1): Vector2 {
    const vector = new Vector2(0, 0);
    vector.magnitude = magnitude;
    vector.angle = angle;
    return vector;
  }

  static fromPoint(point: Point2): Vector2 {
    return new Vector2(point.x, point.y);
  }

  public static zero(): Vector2 {
    return new Vector2(0, 0);
  }

  public get magnitude(): number {
    return Point.distance(Point.ORIGIN, this);
  }

  public set magnitude(magnitude: number) {
    const angle = this.angle;
    this.x = magnitude * Math.cos(angle);
    this.y = magnitude * Math.sin(angle);
  }

  public get magnitudeSquared(): number {
    return this.dot(this);
  }

  public get angle(): number {
    return Math.atan2(this.y, this.x);
  }

  set angle(angle: number) {
    const magnitude = this.magnitude;
    this.x = magnitude * Math.cos(angle);
    this.y = magnitude * Math.sin(angle);
  }

  public dot(other: Point2): number {
    return this.x * other.x + this.y * other.y;
  }

  public normalize(): Vector2 {
    const magnitude = this.magnitude;
    this.x /= magnitude || 1;
    this.y /= magnitude || 1;
    return this;
  }

  public rotate(radians: number): Vector2 {
    const sin = Math.sin(radians);
    const cos = Math.cos(radians);
    const x = this.x;
    const y = this.y;

    this.x = cos * x - sin * y;
    this.y = sin * x + cos * y;
    return this;
  }

  public add(other: Point2): Vector2 {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  public addScalar(other: number): Vector2 {
    this.x += other;
    this.y += other;
    return this;
  }

  public subtract(other: Point2): Vector2 {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }

  public subtractScalar(other: number): Vector2 {
    this.x -= other;
    this.y -= other;
    return this;
  }

  public multiply(other: Point2): Vector2 {
    this.x *= other.x;
    this.y *= other.y;
    return this;
  }

  public multiplyScalar(other: number): Vector2 {
    this.x *= other;
    this.y *= other;
    return this;
  }

  public divide(other: Point2): Vector2 {
    this.x /= other.x;
    this.y /= other.y;
    return this;
  }

  public divideScalar(scalar: number): Vector2 {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }

  public negate(): Vector2 {
    this.x *= -1;
    this.y *= -1;
    return this;
  }

  public abs(): Vector2 {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);
    return this;
  }

  public equals(other: Vector2, epsilon: number = Number.EPSILON): boolean {
    return Point.equals(this, other, epsilon);
  }

  public copy(other: Vector2): Vector2 {
    this.x = other.x;
    this.y = other.y;
    return this;
  }

  public clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  public toString(): string {
    const x = this.x.toFixed(1);
    const y = this.y.toFixed(1);

    return `Vector2(x:${x}, y:${y})`;
  }
}

export namespace Vector {
  export function angle(first: Vector2, second: Vector2): number {
    // TODO correct?
    return Math.atan2(second.y - first.y, second.x - first.x);
  }
}
