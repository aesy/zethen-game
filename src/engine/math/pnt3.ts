import { Vec3 } from "@/engine/math/vec3";
import { Mat3x3Like } from "@/engine/math/mat3x3";

export type Pnt3Like = {
  x: number;
  y: number;
  z: number;
};

export type ReadonlyPnt3 = Readonly<Pnt3Like> & {
  directionTo(other: Readonly<Pnt3Like>): Vec3;
  distanceTo(other: Readonly<Pnt3Like>): number;
  distanceToSquared(other: Readonly<Pnt3Like>): number;
  isZero(epsilon?: number): boolean;
  isNan(): boolean;
  equals(other: Readonly<Pnt3Like>, epsilon?: number): boolean;
  clone(): Pnt3;
  toVec(): Vec3;
  toString(): string;
};

export class Pnt3 implements Pnt3Like, ReadonlyPnt3 {
  public static ORIGIN: ReadonlyPnt3 = Pnt3.zero();

  constructor(
    public x: number,
    public y: number,
    public z: number,
  ) {}

  public static zero(): Pnt3 {
    return new Pnt3(0, 0, 0);
  }

  public static midpoint(
    first: Readonly<Pnt3Like>,
    second: Readonly<Pnt3Like>,
  ): Pnt3 {
    return new Pnt3(
      (first.x + second.x) / 2,
      (first.y + second.y) / 2,
      (first.z + second.z) / 2,
    );
  }

  public static from(other: Readonly<Partial<Pnt3Like>>): Pnt3 {
    return new Pnt3(other.x ?? 0, other.y ?? 0, other.z ?? 0);
  }

  public add(other: Readonly<Pnt3Like>): this {
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

  public subtract(other: Readonly<Pnt3Like>): this {
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

  public multiply(other: Readonly<Pnt3Like>): this {
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

  public divide(other: Readonly<Pnt3Like>): this {
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

  public directionTo(other: Readonly<Pnt3Like>): Vec3 {
    return Vec3.direction(this, other);
  }

  public distanceTo(other: Readonly<Pnt3Like>): number {
    return Pnt3.distanceBetween(this, other);
  }

  public distanceToSquared(other: Readonly<Pnt3Like>): number {
    return Pnt3.distanceBetweenSquared(this, other);
  }

  public isZero(epsilon = Number.EPSILON): boolean {
    return Pnt3.isZero(this, epsilon);
  }

  public isNan(): boolean {
    return Pnt3.isNan(this);
  }

  public equals(other: Readonly<Pnt3Like>, epsilon = Number.EPSILON): boolean {
    return Pnt3.equals(this, other, epsilon);
  }

  public copy(other: Readonly<Pnt3Like>): this {
    this.x = other.x;
    this.y = other.y;
    this.z = other.z;
    return this;
  }

  public clone(): Pnt3 {
    return new Pnt3(this.x, this.y, this.z);
  }

  public toVec(): Vec3 {
    return Vec3.from(this);
  }

  public toString(): string {
    const x = this.x.toFixed(1);
    const y = this.y.toFixed(1);
    const z = this.z.toFixed(1);

    return `Pnt3(x:${x}, y:${y}, z:${z})`;
  }
}

export namespace Pnt3 {
  export function add(
    first: Readonly<Pnt3Like>,
    second: Readonly<Pnt3Like>,
  ): Pnt3Like {
    return {
      x: first.x + second.x,
      y: first.y + second.y,
      z: first.z + second.z,
    };
  }

  export function addScalar(
    first: Readonly<Pnt3Like>,
    scalar: number,
  ): Pnt3Like {
    return {
      x: first.x + scalar,
      y: first.y + scalar,
      z: first.z + scalar,
    };
  }

  export function subtract(
    first: Readonly<Pnt3Like>,
    second: Readonly<Pnt3Like>,
  ): Pnt3Like {
    return {
      x: first.x - second.x,
      y: first.y - second.y,
      z: first.z - second.z,
    };
  }

  export function subtractScalar(
    first: Readonly<Pnt3Like>,
    scalar: number,
  ): Pnt3Like {
    return {
      x: first.x - scalar,
      y: first.y - scalar,
      z: first.z - scalar,
    };
  }

  export function multiply(
    first: Readonly<Pnt3Like>,
    second: Readonly<Pnt3Like>,
  ): Pnt3Like {
    return {
      x: first.x * second.x,
      y: first.y * second.y,
      z: first.z * second.z,
    };
  }

  export function multiplyScalar(
    first: Readonly<Pnt3Like>,
    scalar: number,
  ): Pnt3Like {
    return {
      x: first.x * scalar,
      y: first.y * scalar,
      z: first.z * scalar,
    };
  }

  export function divide(
    first: Readonly<Pnt3Like>,
    second: Readonly<Pnt3Like>,
  ): Pnt3Like {
    return {
      x: first.x / second.x,
      y: first.y / second.y,
      z: first.z / second.z,
    };
  }

  export function divideScalar(
    first: Readonly<Pnt3Like>,
    scalar: number,
  ): Pnt3Like {
    return {
      x: first.x / scalar,
      y: first.y / scalar,
      z: first.z / scalar,
    };
  }

  export function transformMat3(
    point: Readonly<Pnt3Like>,
    mat: Readonly<Mat3x3Like>,
  ): Pnt3Like {
    return {
      x: mat[0] + point.y * mat[3] + point.z * mat[6],
      y: mat[1] + point.y * mat[4] + point.z * mat[7],
      z: mat[2] + point.y * mat[5] + point.z * mat[8],
    };
  }

  export function distanceBetween(
    first: Readonly<Pnt3Like>,
    second: Readonly<Pnt3Like>,
  ): number {
    return Math.sqrt(Pnt3.distanceBetweenSquared(first, second));
  }

  export function distanceBetweenSquared(
    first: Readonly<Pnt3Like>,
    second: Readonly<Pnt3Like>,
  ): number {
    const dx = first.x - second.x;
    const dy = first.y - second.y;
    const dz = first.z - second.z;

    return Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2);
  }

  export function isZero(
    point: Readonly<Pnt3Like>,
    epsilon = Number.EPSILON,
  ): boolean {
    return (
      Math.abs(point.x) < epsilon &&
      Math.abs(point.y) < epsilon &&
      Math.abs(point.z) < epsilon
    );
  }

  export function isNan(point: Readonly<Pnt3Like>): boolean {
    return isNaN(point.x) || isNaN(point.y) || isNaN(point.z);
  }

  export function equals(
    first: Readonly<Pnt3Like>,
    second: Readonly<Pnt3Like>,
    epsilon = Number.EPSILON,
  ): boolean {
    return (
      Math.abs(first.x - second.x) < epsilon &&
      Math.abs(first.y - second.y) < epsilon &&
      Math.abs(first.z - second.z) < epsilon
    );
  }
}
