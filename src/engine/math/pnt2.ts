import { Vec2, Vec2Like } from "@/engine/math/vec2";
import { Mat3x3Like } from "@/engine/math/mat3x3";
import { Mat2x2Like } from "@/engine/math/mat2x2";

export type Pnt2Like = {
  x: number;
  y: number;
};

export type ReadonlyPnt2 = Readonly<Pnt2Like> & {
  directionTo(other: Readonly<Pnt2Like>): Vec2;
  distanceTo(other: Readonly<Pnt2Like>): number;
  distanceToSquared(other: Readonly<Pnt2Like>): number;
  isZero(epsilon?: number): boolean;
  isNan(): boolean;
  equals(other: Readonly<Pnt2Like>, epsilon?: number): boolean;
  clone(): Pnt2;
  toVec(): Vec2;
  toString(): string;
};

export class Pnt2 implements Pnt2Like, ReadonlyPnt2 {
  public static ORIGIN: ReadonlyPnt2 = Pnt2.zero();

  constructor(
    public x: number,
    public y: number,
  ) {}

  public static zero(): Pnt2 {
    return new Pnt2(0, 0);
  }

  public static midpoint(
    first: Readonly<Pnt2Like>,
    second: Readonly<Pnt2Like>,
  ): Pnt2 {
    return new Pnt2((first.x + second.x) / 2, (first.y + second.y) / 2);
  }

  public static from(other: Readonly<Partial<Pnt2Like>>): Pnt2 {
    return new Pnt2(other.x ?? 0, other.y ?? 0);
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

  public subtract(other: Readonly<Pnt2Like>): this {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }

  public subtractScalar(scalar: number): this {
    this.x -= scalar;
    this.y -= scalar;
    return this;
  }

  public multiply(other: Readonly<Pnt2Like>): this {
    this.x *= other.x;
    this.y *= other.y;
    return this;
  }

  public multiplyScalar(scalar: number): this {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  public divide(other: Readonly<Pnt2Like>): this {
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

  public directionTo(other: Readonly<Pnt2Like>): Vec2 {
    return Vec2.direction(this, other);
  }

  public distanceTo(other: Readonly<Pnt2Like>): number {
    return Pnt2.distanceBetween(this, other);
  }

  public distanceToSquared(other: Readonly<Pnt2Like>): number {
    return Pnt2.distanceBetweenSquared(this, other);
  }

  public isZero(epsilon = Number.EPSILON): boolean {
    return Pnt2.isZero(this, epsilon);
  }

  public isNan(): boolean {
    return Pnt2.isNan(this);
  }

  public equals(other: Readonly<Pnt2Like>, epsilon = Number.EPSILON): boolean {
    return Pnt2.equals(this, other, epsilon);
  }

  public copy(other: Readonly<Pnt2Like>): this {
    this.x = other.x;
    this.y = other.y;
    return this;
  }

  public clone(): Pnt2 {
    return new Pnt2(this.x, this.y);
  }

  public toVec(): Vec2 {
    return Vec2.from(this);
  }

  public toString(): string {
    const x = this.x.toFixed(1);
    const y = this.y.toFixed(1);

    return `Pnt2(x:${x}, y:${y})`;
  }
}

export namespace Pnt2 {
  export function add(
    first: Readonly<Pnt2Like>,
    second: Readonly<Pnt2Like>,
  ): Pnt2Like {
    return {
      x: first.x + second.x,
      y: first.y + second.y,
    };
  }

  export function addScalar(
    first: Readonly<Pnt2Like>,
    scalar: number,
  ): Pnt2Like {
    return {
      x: first.x + scalar,
      y: first.y + scalar,
    };
  }

  export function subtract(
    first: Readonly<Pnt2Like>,
    second: Readonly<Pnt2Like>,
  ): Pnt2Like {
    return {
      x: first.x - second.x,
      y: first.y - second.y,
    };
  }

  export function subtractScalar(
    first: Readonly<Pnt2Like>,
    scalar: number,
  ): Pnt2Like {
    return {
      x: first.x - scalar,
      y: first.y - scalar,
    };
  }

  export function multiply(
    first: Readonly<Pnt2Like>,
    second: Readonly<Pnt2Like>,
  ): Pnt2Like {
    return {
      x: first.x * second.x,
      y: first.y * second.y,
    };
  }

  export function multiplyScalar(
    first: Readonly<Pnt2Like>,
    scalar: number,
  ): Pnt2Like {
    return {
      x: first.x * scalar,
      y: first.y * scalar,
    };
  }

  export function divide(
    first: Readonly<Pnt2Like>,
    second: Readonly<Pnt2Like>,
  ): Pnt2Like {
    return {
      x: first.x / second.x,
      y: first.y / second.y,
    };
  }

  export function divideScalar(
    first: Readonly<Pnt2Like>,
    scalar: number,
  ): Pnt2Like {
    return {
      x: first.x / scalar,
      y: first.y / scalar,
    };
  }

  export function transformMat2(
    point: Readonly<Pnt2Like>,
    mat: Readonly<Mat2x2Like>,
  ): Pnt2Like {
    return {
      x: mat[0] * point.x + mat[2] * point.y,
      y: mat[1] * point.x + mat[3] * point.y,
    };
  }

  export function transformMat3(
    point: Readonly<Pnt2Like>,
    mat: Readonly<Mat3x3Like>,
  ): Pnt2Like {
    return {
      x: mat[0] * point.x + mat[3] * point.y + mat[6],
      y: mat[1] * point.x + mat[4] * point.y + mat[7],
    };
  }

  export function distanceBetween(
    first: Readonly<Pnt2Like>,
    second: Readonly<Pnt2Like>,
  ): number {
    return Math.sqrt(Pnt2.distanceBetweenSquared(first, second));
  }

  export function distanceBetweenSquared(
    first: Readonly<Pnt2Like>,
    second: Readonly<Pnt2Like>,
  ): number {
    const dx = first.x - second.x;
    const dy = first.y - second.y;

    return Math.pow(dx, 2) + Math.pow(dy, 2);
  }

  export function isZero(
    point: Readonly<Pnt2Like>,
    epsilon = Number.EPSILON,
  ): boolean {
    return Math.abs(point.x) < epsilon && Math.abs(point.y) < epsilon;
  }

  export function isNan(point: Readonly<Pnt2Like>): boolean {
    return isNaN(point.x) || isNaN(point.y);
  }

  export function equals(
    first: Readonly<Pnt2Like>,
    second: Readonly<Pnt2Like>,
    epsilon = Number.EPSILON,
  ): boolean {
    return (
      Math.abs(first.x - second.x) < epsilon &&
      Math.abs(first.y - second.y) < epsilon
    );
  }
}
