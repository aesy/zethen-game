import { Pnt2, Pnt2Like } from "@/engine/math/pnt2";

export type Vec2Like = Pnt2Like;

export type ReadonlyVec2 = Readonly<Vec2Like> & {
  angle: number;
  magnitude: number;
  magnitudeSquared: number;
  dot(other: Readonly<Vec2Like>): number;
  equals(other: Readonly<Vec2Like>, epsilon?: number): boolean;
  isZero(epsilon?: number): boolean;
  isNan(): boolean;
  clone(): Vec2;
  toString(): string;
};

export class Vec2 implements Vec2Like, ReadonlyVec2 {
  constructor(
    public x: number,
    public y: number,
  ) {}

  public get magnitude(): number {
    return Vec2.getMagnitude(this);
  }

  public set magnitude(magnitude: number) {
    const angle = this.angle;
    this.x = magnitude * Math.cos(angle);
    this.y = magnitude * Math.sin(angle);
  }

  public get magnitudeSquared(): number {
    return Vec2.getMagnitudeSquared(this);
  }

  public get angle(): number {
    return Vec2.getAngle(this);
  }

  public set angle(angle: number) {
    const magnitude = this.magnitude;
    this.x = magnitude * Math.cos(angle);
    this.y = magnitude * Math.sin(angle);
  }

  public static identity(): Vec2 {
    return new Vec2(1, 1);
  }

  public static fromAngle(angle: number, magnitude = 1): Vec2 {
    const vector = new Vec2(0, 0);
    vector.magnitude = magnitude;
    vector.angle = angle;
    return vector;
  }

  public static from(point: Readonly<Vec2Like>): Vec2 {
    return new Vec2(point.x, point.y);
  }

  public static zero(): Vec2 {
    return new Vec2(0, 0);
  }

  public static getAngle(vec: Readonly<Vec2Like>): number {
    return Math.atan2(vec.y, vec.x);
  }

  public static getMagnitude(vec: Readonly<Vec2Like>): number {
    return Math.sqrt(Vec2.getMagnitudeSquared(vec));
  }

  public static getMagnitudeSquared(vec: Readonly<Vec2Like>): number {
    return Math.pow(vec.x, 2) + Math.pow(vec.y, 2);
  }

  public static dot(
    first: Readonly<Vec2Like>,
    second: Readonly<Vec2Like>,
  ): number {
    return first.x * second.x + first.y * second.y;
  }

  public static normalize(vec: Readonly<Vec2Like>): Vec2 {
    return Vec2.from(vec).normalize();
  }

  public static rotate(vec: Readonly<Vec2Like>, radians: number): Vec2 {
    return Vec2.from(vec).rotate(radians);
  }

  public static add(
    first: Readonly<Vec2Like>,
    second: Readonly<Vec2Like>,
  ): Vec2 {
    return Vec2.from(first).add(second);
  }

  public static addScalar(first: Readonly<Vec2Like>, scalar: number): Vec2 {
    return Vec2.from(first).addScalar(scalar);
  }

  public static subtract(
    first: Readonly<Vec2Like>,
    second: Readonly<Vec2Like>,
  ): Vec2 {
    return Vec2.from(first).subtract(second);
  }

  public static subtractScalar(
    first: Readonly<Vec2Like>,
    scalar: number,
  ): Vec2 {
    return Vec2.from(first).subtractScalar(scalar);
  }

  public static multiply(
    first: Readonly<Vec2Like>,
    second: Readonly<Vec2Like>,
  ): Vec2 {
    return Vec2.from(first).multiply(second);
  }

  public static multiplyScalar(
    first: Readonly<Vec2Like>,
    scalar: number,
  ): Vec2 {
    return Vec2.from(first).multiplyScalar(scalar);
  }

  public static divide(
    first: Readonly<Vec2Like>,
    second: Readonly<Vec2Like>,
  ): Vec2 {
    return Vec2.from(first).divide(second);
  }

  public static divideScalar(first: Readonly<Vec2Like>, scalar: number): Vec2 {
    return Vec2.from(first).divideScalar(scalar);
  }

  public static negate(vec: Readonly<Vec2Like>): Vec2 {
    return Vec2.from(vec).negate();
  }

  public static abs(vec: Readonly<Vec2Like>): Vec2 {
    return Vec2.from(vec).abs();
  }

  public static isZero(
    vec: Readonly<Vec2Like>,
    epsilon = Number.EPSILON,
  ): boolean {
    return Vec2.equals(Pnt2.ORIGIN, vec, epsilon);
  }

  public static isNan(vec: Readonly<Vec2Like>): boolean {
    return isNaN(vec.x) || isNaN(vec.y);
  }

  public static equals(
    first: Readonly<Vec2Like>,
    second: Readonly<Vec2Like>,
    epsilon: number = Number.EPSILON,
  ): boolean {
    return (
      Math.abs(first.x - second.x) < epsilon &&
      Math.abs(first.y - second.y) < epsilon
    );
  }

  public dot(other: Readonly<Vec2Like>): number {
    return this.x * other.x + this.y * other.y;
  }

  public normalize(): this {
    const magnitude = this.magnitude;
    this.x /= magnitude || 1;
    this.y /= magnitude || 1;
    return this;
  }

  public rotate(radians: number): this {
    const sin = Math.sin(radians);
    const cos = Math.cos(radians);
    const x = this.x;
    const y = this.y;

    this.x = cos * x - sin * y;
    this.y = sin * x + cos * y;
    return this;
  }

  public add(other: Readonly<Vec2Like>): this {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  public addScalar(other: number): this {
    this.x += other;
    this.y += other;
    return this;
  }

  public subtract(other: Readonly<Vec2Like>): this {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }

  public subtractScalar(other: number): this {
    this.x -= other;
    this.y -= other;
    return this;
  }

  public multiply(other: Readonly<Vec2Like>): this {
    this.x *= other.x;
    this.y *= other.y;
    return this;
  }

  public multiplyScalar(other: number): this {
    this.x *= other;
    this.y *= other;
    return this;
  }

  public divide(other: Readonly<Vec2Like>): this {
    this.x /= other.x;
    this.y /= other.y;
    return this;
  }

  public divideScalar(scalar: number): this {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }

  public negate(): this {
    this.x *= -1;
    this.y *= -1;
    return this;
  }

  public abs(): this {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);
    return this;
  }

  public isZero(epsilon = Number.EPSILON): boolean {
    return Vec2.equals(this, Pnt2.ORIGIN, epsilon);
  }

  public isNan(): boolean {
    return Vec2.isNan(this);
  }

  public equals(
    other: Readonly<Vec2Like>,
    epsilon: number = Number.EPSILON,
  ): boolean {
    return Vec2.equals(this, other, epsilon);
  }

  public copy(other: Readonly<Vec2Like>): this {
    this.x = other.x;
    this.y = other.y;
    return this;
  }

  public clone(): Vec2 {
    return new Vec2(this.x, this.y);
  }

  public toString(): string {
    const x = this.x.toFixed(1);
    const y = this.y.toFixed(1);

    return `Vec2(x:${x}, y:${y})`;
  }
}
