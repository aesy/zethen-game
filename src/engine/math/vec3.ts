import { clamp } from "@/engine/util/math";
import { Pnt3 } from "@/engine/math/pnt3";
import { Mat3x3Like } from "./mat3x3";

export type Vec3Like = {
  x: number;
  y: number;
  z: number;
};

export type ReadonlyVec3 = Readonly<Vec3Like> & {
  readonly magnitude: number;
  readonly magnitudeSquared: number;
  dot(other: Readonly<Vec3Like>): number;
  cross(other: Readonly<Vec3Like>): Vec3;
  isZero(epsilon?: number): boolean;
  isNan(): boolean;
  equals(other: Readonly<Vec3Like>, epsilon?: number): boolean;
  clone(): Vec3;
  toPoint(): Pnt3;
  toString(): string;
};

export class Vec3 implements Vec3Like, ReadonlyVec3 {
  public static ZERO: ReadonlyVec3 = Vec3.zero();

  constructor(
    public x: number,
    public y: number,
    public z: number,
  ) {}

  public get magnitude(): number {
    return Vec3.getMagnitude(this);
  }

  public set magnitude(magnitude: number) {
    Vec3.setMagnitude(this, magnitude);
  }

  public get magnitudeSquared(): number {
    return Vec3.getMagnitudeSquared(this);
  }

  public static zero(): Vec3 {
    return new Vec3(0, 0, 0);
  }

  public static direction(
    first: Readonly<Vec3Like>,
    second: Readonly<Vec3Like>,
  ): Vec3 {
    return Vec3.from(second).subtract(first);
  }

  public static from(vec: Readonly<Partial<Vec3Like>>): Vec3 {
    return new Vec3(vec.x ?? 0, vec.y ?? 0, vec.z ?? 0);
  }

  public dot(other: Readonly<Vec3Like>): number {
    return Vec3.dot(this, other);
  }

  public cross(other: Readonly<Vec3Like>): Vec3 {
    return Vec3.from(Vec3.cross(this, other));
  }

  public normalize(): this {
    const magnitude = this.magnitude;

    this.x = this.x / magnitude || 1;
    this.y = this.y / magnitude || 1;
    this.z = this.z / magnitude || 1;

    return this;
  }

  public add(other: Readonly<Vec3Like>): this {
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
    return this;
  }

  public addScalar(scalar: number): this {
    this.x += scalar;
    this.y += scalar;
    this.z += scalar;
    return this;
  }

  public subtract(other: Readonly<Vec3Like>): this {
    this.x -= other.x;
    this.y -= other.y;
    this.z -= other.z;
    return this;
  }

  public subtractScalar(scalar: number): this {
    this.x -= scalar;
    this.y -= scalar;
    this.z -= scalar;
    return this;
  }

  public multiply(other: Readonly<Vec3Like>): this {
    this.x *= other.x;
    this.y *= other.y;
    this.z *= other.z;
    return this;
  }

  public multiplyScalar(scalar: number): this {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
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

  public transformMat3(mat: Readonly<Mat3x3Like>): this {
    const { x, y, z } = this;
    this.x = x * mat[0] + y * mat[3] + z * mat[6];
    this.y = x * mat[1] + y * mat[4] + z * mat[7];
    this.z = x * mat[2] + y * mat[5] + z * mat[8];
    return this;
  }

  public negate(): this {
    this.x *= -1;
    this.y *= -1;
    this.z *= -1;
    return this;
  }

  public invert(): this {
    this.x = 1 / this.x;
    this.y = 1 / this.y;
    this.z = 1 / this.z;
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

  public toPoint(): Pnt3 {
    return Pnt3.from(this);
  }

  public toString(): string {
    const x = this.x.toFixed(1);
    const y = this.y.toFixed(1);
    const z = this.z.toFixed(1);

    return `Vec3(x:${x}, y:${y}, z:${z})`;
  }
}

export namespace Vec3 {
  export function getMagnitude(vec: Readonly<Vec3Like>): number {
    return Math.sqrt(Vec3.getMagnitudeSquared(vec));
  }

  export function setMagnitude(
    vec: Readonly<Vec3Like>,
    magnitude: number,
  ): Vec3Like {
    const current = Vec3.getMagnitude(vec);

    return {
      x: (vec.x / current) * magnitude,
      y: (vec.y / current) * magnitude,
      z: (vec.z / current) * magnitude,
    };
  }

  export function getMagnitudeSquared(vec: Readonly<Vec3Like>): number {
    return Math.pow(vec.x, 2) + Math.pow(vec.y, 2) + Math.pow(vec.z, 2);
  }

  export function dot(
    first: Readonly<Vec3Like>,
    second: Readonly<Vec3Like>,
  ): number {
    return first.x * second.x + first.y * second.y + first.z * second.z;
  }

  export function cross(
    first: Readonly<Vec3Like>,
    second: Readonly<Vec3Like>,
  ): Vec3Like {
    return {
      x: first.y * second.z - first.z * second.y,
      y: first.z * second.x - first.x * second.z,
      z: first.x * second.y - first.y * second.x,
    };
  }

  export function normalize(vec: Readonly<Vec3Like>): Vec3Like {
    const magnitude = Vec3.getMagnitude(vec);

    return {
      x: vec.x / magnitude || 1,
      y: vec.y / magnitude || 1,
      z: vec.z / magnitude || 1,
    };
  }

  export function add(
    first: Readonly<Vec3Like>,
    second: Readonly<Vec3Like>,
  ): Vec3Like {
    return {
      x: first.x + second.x,
      y: first.y + second.y,
      z: first.z + second.z,
    };
  }

  export function addScalar(vec: Readonly<Vec3Like>, scalar: number): Vec3Like {
    return {
      x: vec.x + scalar,
      y: vec.y + scalar,
      z: vec.z + scalar,
    };
  }

  export function subtract(
    first: Readonly<Vec3Like>,
    second: Readonly<Vec3Like>,
  ): Vec3Like {
    return {
      x: first.x - second.x,
      y: first.y - second.y,
      z: first.z - second.z,
    };
  }

  export function subtractScalar(
    vec: Readonly<Vec3Like>,
    scalar: number,
  ): Vec3Like {
    return {
      x: vec.x - scalar,
      y: vec.y - scalar,
      z: vec.z - scalar,
    };
  }

  export function multiply(
    first: Readonly<Vec3Like>,
    second: Readonly<Vec3Like>,
  ): Vec3Like {
    return {
      x: first.x * second.x,
      y: first.y * second.y,
      z: first.z * second.z,
    };
  }

  export function multiplyScalar(
    vec: Readonly<Vec3Like>,
    scalar: number,
  ): Vec3Like {
    return {
      x: vec.x * scalar,
      y: vec.y * scalar,
      z: vec.z * scalar,
    };
  }

  export function divide(
    first: Readonly<Vec3Like>,
    second: Readonly<Vec3Like>,
  ): Vec3Like {
    return {
      x: first.x / second.x,
      y: first.y / second.y,
      z: first.z / second.z,
    };
  }

  export function divideScalar(
    vec: Readonly<Vec3Like>,
    scalar: number,
  ): Vec3Like {
    return {
      x: vec.x / scalar,
      y: vec.y / scalar,
      z: vec.z / scalar,
    };
  }

  export function transformMat3(
    vec: Readonly<Vec3Like>,
    mat: Readonly<Mat3x3Like>,
  ): Vec3Like {
    return {
      x: mat[0] + vec.y * mat[3] + vec.z * mat[6],
      y: mat[1] + vec.y * mat[4] + vec.z * mat[7],
      z: mat[2] + vec.y * mat[5] + vec.z * mat[8],
    };
  }

  export function negate(vec: Readonly<Vec3Like>): Vec3Like {
    return {
      x: vec.x * -1,
      y: vec.y * -1,
      z: vec.z * -1,
    };
  }

  export function invert(vec: Readonly<Vec3Like>): Vec3Like {
    return {
      x: 1 / vec.x,
      y: 1 / vec.y,
      z: 1 / vec.z,
    };
  }

  export function maxMagnitude(
    vec: Readonly<Vec3Like>,
    value: number,
  ): Vec3Like {
    return Vec3.setMagnitude(vec, Math.max(Vec3.getMagnitude(vec), value));
  }

  export function minMagnitude(
    vec: Readonly<Vec3Like>,
    value: number,
  ): Vec3Like {
    return Vec3.setMagnitude(vec, Math.min(Vec3.getMagnitude(vec), value));
  }

  export function clampMagnitude(
    vec: Readonly<Vec3Like>,
    min: number,
    max: number,
  ): Vec3Like {
    return Vec3.setMagnitude(vec, clamp(Vec3.getMagnitude(vec), { min, max }));
  }

  export function isZero(
    vec: Readonly<Vec3Like>,
    epsilon = Number.EPSILON,
  ): boolean {
    return (
      Math.abs(vec.x) < epsilon &&
      Math.abs(vec.y) < epsilon &&
      Math.abs(vec.z) < epsilon
    );
  }

  export function isNan(vec: Readonly<Vec3Like>): boolean {
    return isNaN(vec.x) || isNaN(vec.y) || isNaN(vec.z);
  }

  export function equals(
    first: Readonly<Vec3Like>,
    second: Readonly<Vec3Like>,
    epsilon: number = Number.EPSILON,
  ): boolean {
    return (
      Math.abs(first.x - second.x) <= epsilon &&
      Math.abs(first.y - second.y) <= epsilon &&
      Math.abs(first.z - second.z) <= epsilon
    );
  }
}
