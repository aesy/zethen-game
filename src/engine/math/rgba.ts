export class Rgba {
  constructor(
    public r: number,
    public g: number,
    public b: number,
    public a: number = 1,
  ) {}

  public equals(other: Rgba): boolean {
    return (
      this.r === other.r &&
      this.g === other.g &&
      this.b === other.b &&
      this.a === other.a
    );
  }

  public copy(other: Rgba): Rgba {
    this.r = other.r;
    this.g = other.g;
    this.b = other.b;
    this.a = other.a;
    return this;
  }

  public clone(): Rgba {
    return new Rgba(this.r, this.g, this.b, this.a);
  }

  public toRgbCssString(): string {
    return `rgb(${this.r} ${this.g} ${this.b} / ${this.a * 100}%)`;
  }

  public toString(): string {
    return `Rgba(${this.r.toString(16)}${this.g.toString(16)}${this.b.toString(16)}${this.a.toString(16)})`;
  }
}
