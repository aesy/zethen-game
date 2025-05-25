import { Arrays } from "@/engine/util/arrays";
import { Vec2Like } from "@/engine/math/vec2";

/**
 * A 2x2 matrix represented as a linear array in row-major order.
 *
 * The indices of the array illustrated in the shape of a matrix looks as such:
 *
 * <pre>
 * ⎡ 0 1 ⎤ or ⎡ (0,0) (0,1) ⎤
 * ⎣ 2 3 ⎦    ⎣ (1,0) (1,1) ⎦
 * </pre>
 */
export type Mat2x2Like = [number, number, number, number];

export type ReadonlyMat2x2 = {
  readonly data: Readonly<Mat2x2Like>;
  readonly determinant: number;

  getRow(index: number): [number, number];
  getColumn(index: number): [number, number];
  equals(other: Readonly<Mat2x2Like>): boolean;
  clone(): Mat2x2;
  toString(): string;
};

export class Mat2x2 implements ReadonlyMat2x2 {
  private _data: Mat2x2Like;

  constructor(data: Mat2x2Like) {
    this._data = data;
  }

  public get data(): Readonly<Mat2x2Like> {
    return this._data;
  }

  public get determinant(): number {
    return Mat2x2.determinant(this._data);
  }

  public getRow(index: number): [number, number] {
    const start = index * 2;

    return [this._data[start], this._data[start + 1]];
  }

  public getColumn(index: number): [number, number] {
    return [this._data[index], this._data[index + 2]];
  }

  public equals(other: Readonly<Mat2x2Like>): boolean {
    return Mat2x2.equals(this._data, other);
  }

  public clone(): Mat2x2 {
    return new Mat2x2(this._data.slice() as Mat2x2Like);
  }

  public toString(): string {
    // prettier-ignore
    const [
      a11, a12,
      a21, a22
    ] = this._data;

    return `Mat2x2(
      ${a11}, ${a12},
      ${a21}, ${a22},
    )`;
  }

  public static zero(): Mat2x2 {
    // prettier-ignore
    return new Mat2x2([
      0, 0,
      0, 0
    ]);
  }

  public static identity(): Mat2x2 {
    // prettier-ignore
    return new Mat2x2([
      1, 0,
      0, 1
    ]);
  }

  public static rotation(angle: number): Mat2x2 {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    // prettier-ignore
    return new Mat2x2([
      c, -s,
      s, c
    ]);
  }

  public static scaling({ x, y }: Readonly<Vec2Like>): Mat2x2 {
    // prettier-ignore
    return new Mat2x2([
      x, 0,
      0, y
    ]);
  }

  public static from(mat: Readonly<Mat2x2Like>): Mat2x2 {
    return new Mat2x2(mat.slice() as Mat2x2Like);
  }

  public setRow(index: number, row: [number, number]): void {
    const start = index * 2;

    this._data[start] = row[0];
    this._data[start + 1] = row[1];
  }

  public setColumn(index: number, col: [number, number]): void {
    this._data[index] = col[0];
    this._data[index + 2] = col[1];
  }

  public transpose(): this {
    const a12 = this._data[1];
    this._data[1] = this._data[2];
    this._data[2] = a12;

    return this;
  }

  public add(mat: Readonly<Mat2x2Like>): this {
    this._data[0] += mat[0];
    this._data[1] += mat[1];
    this._data[2] += mat[2];
    this._data[3] += mat[3];

    return this;
  }

  public subtract(mat: Readonly<Mat2x2Like>): this {
    this._data[0] -= mat[0];
    this._data[1] -= mat[1];
    this._data[2] -= mat[2];
    this._data[3] -= mat[3];

    return this;
  }

  public invert(): this | null {
    let det = this.determinant;

    if (det === 0) {
      return null;
    }

    det = 1.0 / det;

    // prettier-ignore
    const [
      a11, a12,
      a21, a22
    ] = this._data;

    this._data[0] = a22 * det;
    this._data[1] = -a12 * det;
    this._data[2] = -a21 * det;
    this._data[3] = a11 * det;

    return this;
  }

  public multiply(other: Readonly<Mat2x2Like>): this {
    // prettier-ignore
    const [
      a11, a12,
      a21, a22
    ] = this._data;
    // prettier-ignore
    const [
      b11, b12,
      b21, b22
    ] = other;

    this._data[0] = a11 * b11 + a12 * b21;
    this._data[1] = a11 * b12 + a12 * b22;
    this._data[2] = a21 * b11 + a22 * b21;
    this._data[3] = a21 * b12 + a22 * b22;

    return this;
  }

  public multiplyScalar(scalar: number): this {
    // prettier-ignore
    const [
      a11, a12,
      a21, a22
    ] = this._data;

    this._data[0] = a11 * scalar;
    this._data[1] = a12 * scalar;
    this._data[2] = a21 * scalar;
    this._data[3] = a22 * scalar;

    return this;
  }

  public rotate(radians: number): this {
    // prettier-ignore
    const [
      a11, a12,
      a21, a22
    ] = this._data;
    const s = Math.sin(radians);
    const c = Math.cos(radians);

    this._data[0] = a11 * c + a21 * s;
    this._data[1] = a12 * c + a22 * s;
    this._data[2] = a11 * -s + a21 * c;
    this._data[3] = a12 * -s + a22 * c;

    return this;
  }

  public scale(vec: Readonly<Vec2Like>): this {
    this._data[0] *= vec.x;
    this._data[1] *= vec.x;
    this._data[2] *= vec.y;
    this._data[3] *= vec.y;

    return this;
  }

  public copy(other: Readonly<Mat2x2Like>): this {
    this._data = other.slice() as Mat2x2Like;

    return this;
  }
}

export namespace Mat2x2 {
  export function determinant(mat: Readonly<Mat2x2Like>): number {
    // prettier-ignore
    const [
      a11, a12,
      a21, a22
    ] = mat;

    return a11 * a22 - a12 * a21;
  }

  export function transpose(mat: Readonly<Mat2x2Like>): Mat2x2Like {
    // prettier-ignore
    const [
      a11, a12,
      a21, a22
    ] = mat;

    // prettier-ignore
    return [
      a11, a21,
      a12, a22
    ];
  }

  export function adjoint(mat: Readonly<Mat2x2Like>): Mat2x2Like {
    // prettier-ignore
    const [
      a11, a12,
      a21, a22
    ] = mat;

    // prettier-ignore
    return [
      a22, -a12,
      -a21, a11
    ];
  }

  export function inverse(mat: Mat2x2Like): Mat2x2Like | null {
    let det = determinant(mat);

    if (det === 0) {
      return null;
    }

    det = 1.0 / det;

    // prettier-ignore
    const [
      a11, a12,
      a21, a22
    ] = mat;

    // prettier-ignore
    return [
      a22 * det, -a12 * det,
      -a21 * det, a11 * det
    ];
  }

  export function add(
    first: Readonly<Mat2x2Like>,
    second: Readonly<Mat2x2Like>,
  ): Mat2x2Like {
    // prettier-ignore
    const [
      a11, a12,
      a21, a22
    ] = first;
    // prettier-ignore
    const [
      b11, b12,
      b21, b22
    ] = second;

    // prettier-ignore
    return [
      a11 + b11, a12 + b12,
      a21 + b21, a22 + b22
    ];
  }

  export function subtract(
    first: Readonly<Mat2x2Like>,
    second: Readonly<Mat2x2Like>,
  ): Mat2x2Like {
    // prettier-ignore
    const [
      a11, a12,
      a21, a22
    ] = first;
    // prettier-ignore
    const [
      b11, b12,
      b21, b22
    ] = second;

    // prettier-ignore
    return [
      a11 - b11, a12 - b12,
      a21 - b21, a22 - b22
    ];
  }

  export function multiply(
    first: Readonly<Mat2x2Like>,
    second: Readonly<Mat2x2Like>,
  ): Mat2x2Like {
    // prettier-ignore
    const [
      a11, a12,
      a21, a22
    ] = first;
    // prettier-ignore
    const [
      b11, b12,
      b21, b22
    ] = second;

    // prettier-ignore
    return [
      a11 * b11 + a12 * b21, a11 * b12 + a12 * b22,
      a21 * b11 + a22 * b21, a21 * b12 + a22 * b22
    ];
  }

  export function multiplyScalar(
    mat: Readonly<Mat2x2Like>,
    scalar: number,
  ): Mat2x2Like {
    // prettier-ignore
    const [
      a11, a12,
      a21, a22
    ] = mat;

    // prettier-ignore
    return [
      a11 * scalar, a12 * scalar,
      a21 * scalar, a22 * scalar
    ];
  }

  export function rotate(
    mat: Readonly<Mat2x2Like>,
    radians: number,
  ): Mat2x2Like {
    // prettier-ignore
    const [
      a11, a12,
      a21, a22
    ] = mat;
    const s = Math.sin(radians);
    const c = Math.cos(radians);

    // prettier-ignore
    return [
      a11 * c + a12 * s, a11 * -s + a12 * c,
      a21 * c + a22 * s, a21 * -s + a22 * c
    ];
  }

  export function scale(
    mat: Readonly<Mat2x2Like>,
    { x, y }: Readonly<Vec2Like>,
  ): Mat2x2Like {
    // prettier-ignore
    const [
      a11, a12,
      a21, a22
    ] = mat;

    // prettier-ignore
    return [
      a11 * x, a12 * y,
      a21 * x, a22 * y
    ];
  }

  export function equals(
    first: Readonly<Mat2x2Like>,
    second: Readonly<Mat2x2Like>,
  ): boolean {
    return Arrays.equals(first, second);
  }
}
