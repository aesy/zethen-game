import { clamp } from "@/engine/util/math";
import { Pnt2, Pnt2Like } from "@/engine/math/pnt2";
import { Mat3x3Like } from "@/engine/math/mat3x3";
import { Mat2x2Like } from "@/engine/math/mat2x2";

export type Vec2Like = {
  x: number;
  y: number;
};

export type ReadonlyVec2 = Readonly<Vec2Like> & {
  readonly angle: number;
  readonly magnitude: number;
  readonly magnitudeSquared: number;
  dot(other: Readonly<Vec2Like>): number;
  isZero(epsilon?: number): boolean;
  isNan(): boolean;
  equals(other: Readonly<Vec2Like>, epsilon?: number): boolean;
  clone(): Vec2;
  toPoint(): Pnt2;
  toString(): string;
};

export class Vec2 implements Vec2Like, ReadonlyVec2 {
  public static ZERO: ReadonlyVec2 = Vec2.zero();

  constructor(
    public x: number,
    public y: number,
  ) {}

  public get magnitude(): number {
    return Vec2.getMagnitude(this);
  }

  public set magnitude(magnitude: number) {
    const current = this.magnitude;

    this.x = (this.x / current) * magnitude;
    this.y = (this.y / current) * magnitude;
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

  public static zero(): Vec2 {
    return new Vec2(0, 0);
  }

  public static unit(angle: number): Vec2 {
    return Vec2.polar(angle, 1);
  }

  public static polar(angle: number, magnitude: number): Vec2 {
    return new Vec2(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
  }

  public static direction(
    first: Readonly<Pnt2Like>,
    second: Readonly<Pnt2Like>,
  ): Vec2 {
    return Vec2.from(second).subtract(first);
  }

  public static from(point: Readonly<Partial<Vec2Like>>): Vec2 {
    return new Vec2(point.x ?? 0, point.y ?? 0);
  }

  public dot(other: Readonly<Vec2Like>): number {
    return Vec2.dot(this, other);
  }

  public normalize(): this {
    const magnitude = this.magnitude;

    this.x /= magnitude || 1;
    this.y /= magnitude || 1;

    return this;
  }

  public add(other: Readonly<Vec2Like>): this {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  public addScalar(scalar: number): this {
    this.x += scalar;
    this.y += scalar;
    return this;
  }

  public subtract(other: Readonly<Vec2Like>): this {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }

  public subtractScalar(scalar: number): this {
    this.x -= scalar;
    this.y -= scalar;
    return this;
  }

  public multiply(other: Readonly<Vec2Like>): this {
    this.x *= other.x;
    this.y *= other.y;
    return this;
  }

  public multiplyScalar(scalar: number): this {
    this.x *= scalar;
    this.y *= scalar;
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

  public transformMat2(mat: Readonly<Mat2x2Like>): this {
    const { x, y } = this;
    this.x = mat[0] * x + mat[2] * y;
    this.y = mat[1] * x + mat[3] * y;
    return this;
  }

  public transformMat3(mat: Readonly<Mat3x3Like>): this {
    const { x, y } = this;
    this.x = mat[0] * x + mat[3] * y + mat[6];
    this.y = mat[1] * x + mat[4] * y + mat[7];
    return this;
  }

  public negate(): this {
    this.x *= -1;
    this.y *= -1;
    return this;
  }

  public invert(): this {
    this.x = 1 / this.x;
    this.y = 1 / this.y;
    return this;
  }

  public maxMagnitude(value: number): this {
    this.magnitude = Math.max(this.magnitude, value);
    return this;
  }

  public minMagnitude(value: number): this {
    this.magnitude = Math.min(this.magnitude, value);
    return this;
  }

  public clampMagnitude(min: number, max: number): this {
    this.magnitude = clamp(this.magnitude, { min, max });
    return this;
  }

  public isZero(epsilon = Number.EPSILON): boolean {
    return Vec2.isZero(this, epsilon);
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

  public toPoint(): Pnt2 {
    return Pnt2.from(this);
  }

  public toString(): string {
    const x = this.x.toFixed(1);
    const y = this.y.toFixed(1);

    return `Vec2(x:${x}, y:${y})`;
  }
}

export namespace Vec2 {
  export function getMagnitude(vec: Readonly<Vec2Like>): number {
    return Math.sqrt(Vec2.getMagnitudeSquared(vec));
  }

  export function setMagnitude(
    vec: Readonly<Vec2Like>,
    magnitude: number,
  ): Vec2Like {
    const current = Vec2.getMagnitude(vec);

    return {
      x: (vec.x / current) * magnitude,
      y: (vec.y / current) * magnitude,
    };
  }

  export function getMagnitudeSquared(vec: Readonly<Vec2Like>): number {
    return Math.pow(vec.x, 2) + Math.pow(vec.y, 2);
  }

  export function getAngle(vec: Readonly<Vec2Like>): number {
    return Math.atan2(vec.y, vec.x);
  }

  export function setAngle(vec: Readonly<Vec2Like>, angle: number): Vec2Like {
    const magnitude = Vec2.getMagnitude(vec);

    return {
      x: magnitude * Math.cos(angle),
      y: magnitude * Math.sin(angle),
    };
  }

  export function dot(
    first: Readonly<Vec2Like>,
    second: Readonly<Vec2Like>,
  ): number {
    return first.x * second.x + first.y * second.y;
  }

  export function normalize(vec: Readonly<Vec2Like>): Vec2Like {
    const magnitude = Vec2.getMagnitude(vec);

    return {
      x: vec.x / magnitude || 1,
      y: vec.y / magnitude || 1,
    };
  }

  export function add(
    first: Readonly<Vec2Like>,
    second: Readonly<Vec2Like>,
  ): Vec2Like {
    return {
      x: first.x + second.x,
      y: first.y + second.y,
    };
  }

  export function addScalar(vec: Readonly<Vec2Like>, scalar: number): Vec2Like {
    return {
      x: vec.x + scalar,
      y: vec.y + scalar,
    };
  }

  export function subtract(
    first: Readonly<Vec2Like>,
    second: Readonly<Vec2Like>,
  ): Vec2Like {
    return {
      x: first.x + second.x,
      y: first.y + second.y,
    };
  }

  export function subtractScalar(
    vec: Readonly<Vec2Like>,
    scalar: number,
  ): Vec2Like {
    return {
      x: vec.x + scalar,
      y: vec.y + scalar,
    };
  }

  export function multiply(
    first: Readonly<Vec2Like>,
    second: Readonly<Vec2Like>,
  ): Vec2Like {
    return {
      x: first.x + second.x,
      y: first.y + second.y,
    };
  }

  export function multiplyScalar(
    vec: Readonly<Vec2Like>,
    scalar: number,
  ): Vec2Like {
    return {
      x: vec.x + scalar,
      y: vec.y + scalar,
    };
  }

  export function divide(
    first: Readonly<Vec2Like>,
    second: Readonly<Vec2Like>,
  ): Vec2Like {
    return {
      x: first.x + second.x,
      y: first.y + second.y,
    };
  }

  export function divideScalar(
    vec: Readonly<Vec2Like>,
    scalar: number,
  ): Vec2Like {
    return {
      x: vec.x + scalar,
      y: vec.y + scalar,
    };
  }

  export function transformMat2(
    vec: Readonly<Vec2Like>,
    mat: Readonly<Mat2x2Like>,
  ): Vec2Like {
    return {
      x: mat[0] * vec.x + mat[2] * vec.y,
      y: mat[1] * vec.x + mat[3] * vec.y,
    };
  }

  export function transformMat3(
    vec: Readonly<Vec2Like>,
    mat: Readonly<Mat3x3Like>,
  ): Vec2Like {
    return {
      x: mat[0] * vec.x + mat[3] * vec.y + mat[6],
      y: mat[1] * vec.x + mat[4] * vec.y + mat[7],
    };
  }

  export function negate(vec: Readonly<Vec2Like>): Vec2Like {
    return {
      x: vec.x * -1,
      y: vec.y * -1,
    };
  }

  export function invert(vec: Readonly<Vec2Like>): Vec2Like {
    return {
      x: 1 / vec.x,
      y: 1 / vec.y,
    };
  }

  export function maxMagnitude(
    vec: Readonly<Vec2Like>,
    value: number,
  ): Vec2Like {
    return Vec2.setMagnitude(vec, Math.max(Vec2.getMagnitude(vec), value));
  }

  export function minMagnitude(
    vec: Readonly<Vec2Like>,
    value: number,
  ): Vec2Like {
    return Vec2.setMagnitude(vec, Math.min(Vec2.getMagnitude(vec), value));
  }

  export function clampMagnitude(
    vec: Readonly<Vec2Like>,
    min: number,
    max: number,
  ): Vec2Like {
    return Vec2.setMagnitude(vec, clamp(Vec2.getMagnitude(vec), { min, max }));
  }

  export function isZero(
    vec: Readonly<Vec2Like>,
    epsilon = Number.EPSILON,
  ): boolean {
    return Math.abs(vec.x) < epsilon && Math.abs(vec.y) < epsilon;
  }

  export function isNan(vec: Readonly<Vec2Like>): boolean {
    return isNaN(vec.x) || isNaN(vec.y);
  }

  export function equals(
    first: Readonly<Vec2Like>,
    second: Readonly<Vec2Like>,
    epsilon: number = Number.EPSILON,
  ): boolean {
    return (
      Math.abs(first.x - second.x) <= epsilon &&
      Math.abs(first.y - second.y) <= epsilon
    );
  }
}
