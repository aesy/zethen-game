export class Color {
  private constructor(private str: string) {}

  public static fromRGB(r: number, g: number, b: number, a = 1): Color {
    const str = `rgba(${r},${g},${b},${a})`;

    return new Color(str);
  }

  public toString(): string {
    return this.str;
  }
}
