import { Arrays } from "@/engine/util/arrays";
import { Vec2Like } from "@/engine/math/vec2";
import { Mat2x2, Mat2x2Like } from "@/engine/math/mat2x2";
import { Dim2Like } from "@/engine/math/dim2";

// https://jsantell.com/matrix-transformations/#inverse-matrix

/**
 * A 3x3 matrix represented as a linear array in row-major order.
 *
 * The indices of the array illustrated in the shape of a matrix looks as such:
 *
 * <pre>
 * ⎡ 0 1 2 ⎤    ⎡ (0,0) (0,1) (0,2) ⎤
 * ⎢ 3 4 5 ⎥ or ⎢ (1,0) (1,1) (1,2) ⎥
 * ⎣ 6 7 8 ⎦    ⎣ (2,0) (2,1) (2,2) ⎦
 * </pre>
 */
export type Mat3x3Like = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

export type ReadonlyMat3x3 = {
  readonly data: Readonly<Mat3x3Like>;
  readonly determinant: number;

  getRow(index: number): [number, number, number];
  getColumn(index: number): [number, number, number];
  equals(other: Readonly<Mat3x3Like>): boolean;
  clone(): Mat3x3;
  toString(): string;
};

export class Mat3x3 implements ReadonlyMat3x3 {
  private _data: Mat3x3Like;

  constructor(data: Mat3x3Like) {
    this._data = data;
  }

  public get data(): Readonly<Mat3x3Like> {
    return this._data;
  }

  public get determinant(): number {
    return Mat3x3.determinant(this._data);
  }

  public getRow(index: number): [number, number, number] {
    const start = index * 3;

    return [this._data[start], this._data[start + 1], this._data[start + 2]];
  }

  public getColumn(index: number): [number, number, number] {
    return [this._data[index], this._data[index + 3], this._data[index + 6]];
  }

  public equals(other: Readonly<Mat3x3Like>): boolean {
    return Mat3x3.equals(this._data, other);
  }

  public clone(): Mat3x3 {
    return new Mat3x3(this._data.slice() as Mat3x3Like);
  }

  public toString(): string {
    const d = this._data;

    return `Mat3x3(
      ${d[0]}, ${d[1]}, ${d[2]},
      ${d[3]}, ${d[4]}, ${d[5]},
      ${d[6]}, ${d[7]}, ${d[8]},
    )`;
  }

  public static identity(): Mat3x3 {
    // prettier-ignore
    return new Mat3x3([
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    ]);
  }

  public static translation({ x, y }: Readonly<Vec2Like>): Mat3x3 {
    // prettier-ignore
    return new Mat3x3([
      1, 0, 0,
      0, 1, 0,
      x, y, 1
    ]);
  }

  public static rotation(angle: number): Mat3x3 {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    // prettier-ignore
    return new Mat3x3([
      cos, sin, 0,
      -sin, cos, 0,
      0, 0, 1
    ]);
  }

  public static scaling({ x, y }: Readonly<Vec2Like>): Mat3x3 {
    // prettier-ignore
    return new Mat3x3([
      x, 0, 0,
      0, y, 0,
      0, 0, 1
    ]);
  }

  public static projection({ width, height }: Readonly<Dim2Like>): Mat3x3 {
    const w = 2 / width;
    const h = -2 / height;

    // prettier-ignore
    return new Mat3x3([
      w, 0, 0,
      0, h, 0,
      -1, 1, 1
    ]);
  }

  public static shearing({ x, y }: Readonly<Vec2Like>): Mat3x3 {
    // prettier-ignore
    return new Mat3x3([
      1, y, 0,
      x, 1, 0,
      0, 0, 1
    ]);
  }

  /**
   * Returns a reflect matrix of size 3x3.
   *
   * TODO
   *
   * <pre>
   * ⎡ 1|-1     0  0 ⎤
   * ⎢    0  1|-1  0 ⎥
   * ⎣    0     0  1 ⎦
   * </pre>
   */
  public static reflection({ h, v }: { h: boolean; v: boolean }): Mat3x3 {
    const rh = h ? -1 : 1;
    const rv = v ? -1 : 1;

    // prettier-ignore
    return new Mat3x3([
      rh, 0, 0,
      0, rv, 0,
      0, 0, 1
    ]);
  }

  public static orthographic(
    left: number,
    right: number,
    bottom: number,
    top: number,
  ): Mat3x3 {
    const width = right - left;
    const height = top - bottom;

    // prettier-ignore
    return new Mat3x3([
      2 / width, 0, 0,
      0, -2 / height, 0,
      -(right + left) / width, -(top + bottom) / height, 1
    ]);
  }

  public static from(mat: Readonly<Mat3x3Like>): Mat3x3 {
    return new Mat3x3(mat.slice() as Mat3x3Like);
  }

  public setRow(index: number, row: number[]): void {
    const start = index * 3;

    this._data[start] = row[0];
    this._data[start + 1] = row[1];
    this._data[start + 2] = row[2];
  }

  public setColumn(index: number, col: number[]): void {
    this._data[index] = col[0];
    this._data[index + 3] = col[1];
    this._data[index + 6] = col[2];
  }

  public transpose(): this {
    const a12 = this._data[1];
    const a13 = this._data[2];
    const a23 = this._data[5];

    this._data[1] = this._data[3];
    this._data[2] = this._data[6];
    this._data[3] = a12;
    this._data[5] = this._data[7];
    this._data[6] = a13;
    this._data[7] = a23;

    return this;
  }

  public invert(): this | null {
    // prettier-ignore
    const [
      a11, a12, a13,
      a21, a22, a23,
      a31, a32, a33
    ] = this._data;
    const b11 = a33 * a22 - a23 * a32;
    const b21 = -a33 * a21 + a23 * a31;
    const b31 = a32 * a21 - a22 * a31;

    const det = a11 * b11 + a12 * b21 + a13 * b31;

    if (!det) {
      return null;
    }

    const invDet = 1.0 / det;

    this._data[0] = (a33 * a22 - a23 * a32) * invDet;
    this._data[1] = (-a33 * a12 + a13 * a32) * invDet;
    this._data[2] = (a23 * a12 - a13 * a22) * invDet;
    this._data[3] = (-a33 * a21 + a23 * a31) * invDet;
    this._data[4] = (a33 * a11 - a13 * a31) * invDet;
    this._data[5] = (-a23 * a11 + a13 * a21) * invDet;
    this._data[6] = (a32 * a21 - a22 * a31) * invDet;
    this._data[7] = (-a32 * a11 + a12 * a31) * invDet;
    this._data[8] = (a22 * a11 - a12 * a21) * invDet;

    return this;
  }

  public add(other: Readonly<Mat3x3Like>): this {
    this._data[0] += other[0];
    this._data[1] += other[1];
    this._data[2] += other[2];
    this._data[3] += other[3];
    this._data[4] += other[4];
    this._data[5] += other[5];
    this._data[6] += other[6];
    this._data[7] += other[7];
    this._data[8] += other[8];
    return this;
  }

  public subtract(other: Readonly<Mat3x3Like>): this {
    this._data[0] -= other[0];
    this._data[1] -= other[1];
    this._data[2] -= other[2];
    this._data[3] -= other[3];
    this._data[4] -= other[4];
    this._data[5] -= other[5];
    this._data[6] -= other[6];
    this._data[7] -= other[7];
    this._data[8] -= other[8];
    return this;
  }

  public multiply(other: Readonly<Mat3x3Like>): this {
    // prettier-ignore
    const [
      a11, a12, a13,
      a21, a22, a23,
      a31, a32, a33
    ] = this._data;
    // prettier-ignore
    const [
      b11, b12, b13,
      b21, b22, b23,
      b31, b32, b33
    ] = other;

    this._data[0] = b11 * a11 + b12 * a21 + b13 * a31;
    this._data[1] = b11 * a12 + b12 * a22 + b13 * a32;
    this._data[2] = b11 * a13 + b12 * a23 + b13 * a33;
    this._data[3] = b21 * a11 + b22 * a21 + b23 * a31;
    this._data[4] = b21 * a12 + b22 * a22 + b23 * a32;
    this._data[5] = b21 * a13 + b22 * a23 + b23 * a33;
    this._data[6] = b31 * a11 + b32 * a21 + b33 * a31;
    this._data[7] = b31 * a12 + b32 * a22 + b33 * a32;
    this._data[8] = b31 * a13 + b32 * a23 + b33 * a33;
    return this;
  }

  public multiplyScalar(scalar: number): this {
    this._data[0] *= scalar;
    this._data[1] *= scalar;
    this._data[2] *= scalar;
    this._data[3] *= scalar;
    this._data[4] *= scalar;
    this._data[5] *= scalar;
    this._data[6] *= scalar;
    this._data[7] *= scalar;
    this._data[8] *= scalar;
    return this;
  }

  public translate(vec: Readonly<Vec2Like>): this {
    // prettier-ignore
    const [
      a11, a12, a13,
      a21, a22, a23,
      a31, a32, a33
    ] = this._data;

    this._data[6] = vec.x * a11 + vec.y * a21 + a31;
    this._data[7] = vec.x * a12 + vec.y * a22 + a32;
    this._data[8] = vec.x * a13 + vec.y * a23 + a33;

    return this;
  }

  public rotate(radians: number): this {
    // prettier-ignore
    const [
      a11, a12, a13,
      a21, a22, a23
    ] = this._data;
    const s = Math.sin(radians);
    const c = Math.cos(radians);

    this._data[0] = c * a11 + s * a21;
    this._data[1] = c * a12 + s * a22;
    this._data[2] = c * a13 + s * a23;
    this._data[3] = c * a21 - s * a11;
    this._data[4] = c * a22 - s * a12;
    this._data[5] = c * a23 - s * a13;

    return this;
  }

  public scale(vec: Readonly<Vec2Like>): this {
    this._data[0] *= vec.x;
    this._data[1] *= vec.x;
    this._data[2] *= vec.x;
    this._data[3] *= vec.y;
    this._data[4] *= vec.y;
    this._data[5] *= vec.y;
    return this;
  }

  public copy(other: Readonly<Mat3x3Like>): this {
    this._data = other.slice() as Mat3x3Like;
    return this;
  }
}

export namespace Mat3x3 {
  export function minor(
    mat: Readonly<Mat3x3Like>,
    i: number,
    j: number,
  ): Mat2x2Like {
    return [
      mat[((i + 1) % 3) * 3 + ((j + 1) % 3)],
      mat[((i + 1) % 3) * 3 + ((j + 2) % 3)],
      mat[((i + 2) % 3) * 3 + ((j + 1) % 3)],
      mat[((i + 2) % 3) * 3 + ((j + 2) % 3)],
    ];
  }

  export function determinant(mat: Readonly<Mat3x3Like>): number {
    // prettier-ignore
    const [
      a11, a12, a13,
      a21, a22, a23,
      a31, a32, a33
    ] = mat;
    const b11 = a33 * a22 - a23 * a32;
    const b21 = -a33 * a21 + a23 * a31;
    const b31 = a32 * a21 - a22 * a31;

    return a11 * b11 + a12 * b21 + a13 * b31;
  }

  export function cofactor(mat: Readonly<Mat3x3Like>): Mat3x3Like {
    return Array.from({ length: 9 }, (_v, k) => {
      const min = minor(mat, Math.floor(k / 3), k % 3);
      const sign = k % 2 === 0 ? 1 : -1;
      const det = Mat2x2.determinant(min);

      return sign * det;
    }) as Mat3x3Like;
  }

  /**
   * Returns an adjugate matrix, i.e. the adjoint of a matrix.
   *
   * An adjugate matrix is the transpose of the cofactor elements of a matrix.
   *
   * An adjugate matrix is especially useful in applications where an inverse
   * matrix cannot be used directly.
   */
  export function adjugate(mat: Readonly<Mat3x3Like>): Mat3x3Like {
    return transpose(cofactor(mat));
  }

  export function transpose(mat: Readonly<Mat3x3Like>): Mat3x3Like {
    // prettier-ignore
    return [
      mat[ 0 ], mat[ 3 ], mat[ 6 ],
      mat[ 1 ], mat[ 4 ], mat[ 7 ],
      mat[ 2 ], mat[ 5 ], mat[ 8 ]
    ];
  }

  export function inverse(mat: Readonly<Mat3x3Like>): Mat3x3Like | null {
    // prettier-ignore
    const [
      a11, a12, a13,
      a21, a22, a23,
      a31, a32, a33
    ] = mat;
    const b11 = a33 * a22 - a23 * a32;
    const b21 = -a33 * a21 + a23 * a31;
    const b31 = a32 * a21 - a22 * a31;

    const det = a11 * b11 + a12 * b21 + a13 * b31;

    if (!det) {
      return null;
    }

    const invDet = 1.0 / det;

    return [
      (a33 * a22 - a23 * a32) * invDet,
      (-a33 * a12 + a13 * a32) * invDet,
      (a23 * a12 - a13 * a22) * invDet,
      (-a33 * a21 + a23 * a31) * invDet,
      (a33 * a11 - a13 * a31) * invDet,
      (-a23 * a11 + a13 * a21) * invDet,
      (a32 * a21 - a22 * a31) * invDet,
      (-a32 * a11 + a12 * a31) * invDet,
      (a22 * a11 - a12 * a21) * invDet,
    ];

    // Is this correct?
    // return [
    //   b01 * invDeterminant,
    //   (-a22 * a01 + a02 * a21) * invDeterminant,
    //   (a12 * a01 - a02 * a11) * invDeterminant,
    //   b11 * invDeterminant,
    //   (a22 * a00 - a02 * a20) * invDeterminant,
    //   (-a12 * a00 + a02 * a10) * invDeterminant,
    //   b21 * invDeterminant,
    //   (-a21 * a00 + a01 * a20) * invDeterminant,
    //   (a11 * a00 - a01 * a10) * invDeterminant,
    // ];
  }

  export function add(
    first: Readonly<Mat3x3Like>,
    second: Readonly<Mat3x3Like>,
  ): Mat3x3Like {
    // prettier-ignore
    return [
      first[ 0 ] + second[ 0 ], first[ 1 ] + second[ 1 ], first[ 2 ] + second[ 2 ],
      first[ 3 ] + second[ 3 ], first[ 4 ] + second[ 4 ], first[ 5 ] + second[ 5 ],
      first[ 6 ] + second[ 6 ], first[ 7 ] + second[ 7 ], first[ 8 ] + second[ 8 ]
    ];
  }

  export function subtract(
    first: Readonly<Mat3x3Like>,
    second: Readonly<Mat3x3Like>,
  ): Mat3x3Like {
    // prettier-ignore
    return [
      first[ 0 ] - second[ 0 ], first[ 1 ] - second[ 1 ], first[ 2 ] - second[ 2 ],
      first[ 3 ] - second[ 3 ], first[ 4 ] - second[ 4 ], first[ 5 ] - second[ 5 ],
      first[ 6 ] - second[ 6 ], first[ 7 ] - second[ 7 ], first[ 8 ] - second[ 8 ]
    ];
  }

  export function multiply(
    first: Readonly<Mat3x3Like>,
    second: Readonly<Mat3x3Like>,
  ): Mat3x3Like {
    // prettier-ignore
    const [
      a11, a12, a13,
      a21, a22, a23,
      a31, a32, a33
    ] = first;
    // prettier-ignore
    const [
      b11, b12, b13,
      b21, b22, b23,
      b31, b32, b33
    ] = second;

    return [
      b11 * a11 + b12 * a21 + b13 * a31,
      b11 * a12 + b12 * a22 + b13 * a32,
      b11 * a13 + b12 * a23 + b13 * a33,
      b21 * a11 + b22 * a21 + b23 * a31,
      b21 * a12 + b22 * a22 + b23 * a32,
      b21 * a13 + b22 * a23 + b23 * a33,
      b31 * a11 + b32 * a21 + b33 * a31,
      b31 * a12 + b32 * a22 + b33 * a32,
      b31 * a13 + b32 * a23 + b33 * a33,
    ];
  }

  export function multiplyScalar(
    mat: Readonly<Mat3x3Like>,
    scalar: number,
  ): Mat3x3Like {
    // prettier-ignore
    return [
      mat[ 0 ] * scalar, mat[ 1 ] * scalar, mat[ 2 ] * scalar,
      mat[ 3 ] * scalar, mat[ 4 ] * scalar, mat[ 5 ] * scalar,
      mat[ 6 ] * scalar, mat[ 7 ] * scalar, mat[ 8 ] * scalar
    ];
  }

  export function translate(
    mat: Readonly<Mat3x3Like>,
    vec: Readonly<Vec2Like>,
  ): Mat3x3Like {
    // prettier-ignore
    const [
      a11, a12, a13,
      a21, a22, a23,
      a31, a32, a33
    ] = mat;
    const { x, y } = vec;

    // prettier-ignore
    return [
      a11, a12, a13,
      a21, a22, a23,
      x * a11 + y * a21 + a31, x * a12 + y * a22 + a32, x * a13 + y * a23 + a33
    ];
  }

  export function rotate(
    mat: Readonly<Mat3x3Like>,
    radians: number,
  ): Mat3x3Like {
    // prettier-ignore
    const [
      a11, a12, a13,
      a21, a22, a23,
      a31, a32, a33
    ] = mat;
    const s = Math.sin(radians);
    const c = Math.cos(radians);

    // prettier-ignore
    return [
      c * a11 + s * a21, c * a12 + s * a22, c * a13 + s * a23,
      c * a21 - s * a11, c * a22 - s * a12, c * a23 - s * a13,
      a31, a32, a33
    ];
  }

  export function scale(
    mat: Readonly<Mat3x3Like>,
    vec: Readonly<Vec2Like>,
  ): Mat3x3Like {
    const { x, y } = vec;

    // prettier-ignore
    return [
      x * mat[ 0 ], x * mat[ 1 ], x * mat[ 2 ],
      y * mat[ 3 ], y * mat[ 4 ], y * mat[ 5 ],
      mat[ 6 ], mat[ 7 ], mat[ 8 ]
    ];
  }

  export function shear(
    mat: Readonly<Mat3x3Like>,
    vec: Readonly<Vec2Like>,
  ): Mat3x3Like {
    // prettier-ignore
    const [
      a11, a12, a13,
      a21, a22, a23,
      a31, a32, a33
    ] = mat;
    const { x, y } = vec;

    return [
      a11 + x * a21,
      a12 + x * a22,
      a13 + x * a23,
      y * a11 + a21,
      y * a12 + a22,
      y * a13 + a23,
      a31,
      a32,
      a33,
    ];
  }

  export function equals(
    first: Readonly<Mat3x3Like>,
    second: Readonly<Mat3x3Like>,
  ): boolean {
    return Arrays.equals(first, second);
  }
}
