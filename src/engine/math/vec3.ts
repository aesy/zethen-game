import { Pnt3, Pnt3Like } from "@/engine/math/pnt3";

export type Vec3Like = Pnt3Like;

export type ReadonlyVec3 = Readonly<Vec3Like> & {
  angle: number;
  magnitude: number;
  magnitudeSquared: number;
  dot(other: Readonly<Pnt3Like>): number;
  equals(other: Readonly<Pnt3Like>, epsilon?: number): boolean;
  isZero(epsilon?: number): boolean;
  isNan(): boolean;
  clone(): Vec3;
  toString(): string;
};

export class Vec3 implements Vec3Like, ReadonlyVec3 {
  constructor(
    public x: number,
    public y: number,
    public z: number,
  ) {}

  public get magnitude(): number {
    return Vec3.getMagnitude(this);
  }

  public set magnitude(magnitude: number) {
    const angle = this.angle;
    this.x = magnitude * Math.cos(angle);
    this.y = magnitude * Math.sin(angle);
    this.z = magnitude * Math.sin(angle); // TODO
  }

  public get magnitudeSquared(): number {
    return Vec3.getMagnitudeSquared(this);
  }

  public get angle(): number {
    return Vec3.getAngle(this);
  }

  public set angle(angle: number) {
    const magnitude = this.magnitude;
    this.x = magnitude * Math.cos(angle);
    this.y = magnitude * Math.sin(angle);
    this.z = magnitude * Math.sin(angle);
  }

  public static identity(): Vec3 {
    return new Vec3(1, 1, 1);
  }

  public static fromAngle(angle: number, magnitude = 1): Vec3 {
    const vector = Vec3.zero();
    vector.magnitude = magnitude;
    vector.angle = angle;
    return vector;
  }

  public static from(point: Readonly<Pnt3Like>): Vec3 {
    return new Vec3(point.x, point.y, point.z);
  }

  public static zero(): Vec3 {
    return new Vec3(0, 0, 0);
  }

  public static getAngle(vec: Readonly<Vec3Like>): number {
    // TODO
    return Math.atan2(vec.y, vec.x);
  }

  public static getMagnitude(vec: Readonly<Vec3Like>): number {
    return Math.sqrt(Vec3.getMagnitudeSquared(vec));
  }

  public static getMagnitudeSquared(vec: Readonly<Vec3Like>): number {
    return Math.pow(vec.x, 2) + Math.pow(vec.y, 2) + Math.pow(vec.z, 2);
  }

  public static dot(
    first: Readonly<Vec3Like>,
    second: Readonly<Vec3Like>,
  ): number {
    return first.x * second.x + first.y * second.y + first.z * second.z;
  }

  public static normalize(vec: Readonly<Vec3Like>): Vec3 {
    return Vec3.from(vec).normalize();
  }

  public static rotate(vec: Readonly<Vec3Like>, radians: number): Vec3 {
    return Vec3.from(vec).rotate(radians);
  }

  public static add(
    first: Readonly<Vec3Like>,
    second: Readonly<Vec3Like>,
  ): Vec3 {
    return Vec3.from(first).add(second);
  }

  public static addScalar(first: Readonly<Vec3Like>, scalar: number): Vec3 {
    return Vec3.from(first).addScalar(scalar);
  }

  public static subtract(
    first: Readonly<Vec3Like>,
    second: Readonly<Vec3Like>,
  ): Vec3 {
    return Vec3.from(first).subtract(second);
  }

  public static subtractScalar(
    first: Readonly<Vec3Like>,
    scalar: number,
  ): Vec3 {
    return Vec3.from(first).subtractScalar(scalar);
  }

  public static multiply(
    first: Readonly<Vec3Like>,
    second: Readonly<Vec3Like>,
  ): Vec3 {
    return Vec3.from(first).multiply(second);
  }

  public static multiplyScalar(
    first: Readonly<Vec3Like>,
    scalar: number,
  ): Vec3 {
    return Vec3.from(first).multiplyScalar(scalar);
  }

  public static divide(
    first: Readonly<Vec3Like>,
    second: Readonly<Vec3Like>,
  ): Vec3 {
    return Vec3.from(first).divide(second);
  }

  public static divideScalar(first: Readonly<Vec3Like>, scalar: number): Vec3 {
    return Vec3.from(first).divideScalar(scalar);
  }

  public static negate(vec: Readonly<Vec3Like>): Vec3 {
    return Vec3.from(vec).negate();
  }

  public static abs(vec: Readonly<Vec3Like>): Vec3 {
    return Vec3.from(vec).abs();
  }

  public static isZero(
    vec: Readonly<Vec3Like>,
    epsilon = Number.EPSILON,
  ): boolean {
    return Vec3.equals(Pnt3.ORIGIN, vec, epsilon);
  }

  public static isNan(vec: Readonly<Vec3Like>): boolean {
    return isNaN(vec.x) || isNaN(vec.y) || isNaN(vec.z);
  }

  public static equals(
    first: Readonly<Vec3Like>,
    second: Readonly<Vec3Like>,
    epsilon: number = Number.EPSILON,
  ): boolean {
    return (
      Math.abs(first.x - second.x) < epsilon &&
      Math.abs(first.y - second.y) < epsilon &&
      Math.abs(first.z - second.z) < epsilon
    );
  }

  public dot(other: Readonly<Vec3Like>): number {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }

  public normalize(): this {
    const magnitude = this.magnitude;
    this.x /= magnitude || 1;
    this.y /= magnitude || 1;
    this.z /= magnitude || 1;
    return this;
  }

  public rotate(radians: number): this {
    const sin = Math.sin(radians);
    const cos = Math.cos(radians);
    const x = this.x;
    const y = this.y;
    const z = this.z;

    this.x = cos * x - sin * y;
    this.y = sin * x + cos * y;
    this.z = sin * x + cos * z; // TODO
    return this;
  }

  public add(other: Readonly<Vec3Like>): this {
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
    return this;
  }

  public addScalar(other: number): this {
    this.x += other;
    this.y += other;
    this.z += other;
    return this;
  }

  public subtract(other: Readonly<Vec3Like>): this {
    this.x -= other.x;
    this.y -= other.y;
    this.z -= other.z;
    return this;
  }

  public subtractScalar(other: number): this {
    this.x -= other;
    this.y -= other;
    this.z -= other;
    return this;
  }

  public multiply(other: Readonly<Vec3Like>): this {
    this.x *= other.x;
    this.y *= other.y;
    this.z *= other.z;
    return this;
  }

  public multiplyScalar(other: number): this {
    this.x *= other;
    this.y *= other;
    this.z *= other;
    return this;
  }

  public divide(other: Readonly<Vec3Like>): this {
    this.x /= other.x;
    this.y /= other.y;
    this.z /= other.z;
    return this;
  }

  public divideScalar(scalar: number): this {
    this.x /= scalar;
    this.y /= scalar;
    this.z /= scalar;
    return this;
  }

  public negate(): this {
    this.x *= -1;
    this.y *= -1;
    this.z *= -1;
    return this;
  }

  public abs(): this {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);
    this.z = Math.abs(this.z);
    return this;
  }

  public isZero(epsilon = Number.EPSILON): boolean {
    return Vec3.isZero(this, epsilon);
  }

  public isNan(): boolean {
    return Vec3.isNan(this);
  }

  public equals(
    other: Readonly<Vec3Like>,
    epsilon: number = Number.EPSILON,
  ): boolean {
    return Vec3.equals(this, other, epsilon);
  }

  public copy(other: Readonly<Vec3Like>): this {
    this.x = other.x;
    this.y = other.y;
    this.z = other.z;
    return this;
  }

  public clone(): Vec3 {
    return new Vec3(this.x, this.y, this.z);
  }

  public toString(): string {
    const x = this.x.toFixed(1);
    const y = this.y.toFixed(1);
    const z = this.y.toFixed(1);

    return `Vec3(x:${x}, y:${y}, z:${z})`;
  }
}
