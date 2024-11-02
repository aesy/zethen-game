export namespace Arrays {
  export function chunk<T>(arr: T[], chunkSize: number): T[][] {
    if (chunkSize < 0) {
      throw new Error("Invalid chunk size");
    }

    const chunks = [];

    for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize);
      chunks.push(chunk);
    }

    return chunks;
  }

  export function pickRandom<T>(arr: T[]): T {
    const len = arr.length;

    if (len <= 0) {
      throw new Error("Invalid array size");
    }

    const index = Math.floor(Math.random() * len);

    return arr[index];
  }
}
