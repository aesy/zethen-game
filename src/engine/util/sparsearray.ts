export class SparseArray<T> implements Iterable<T> {
  private readonly dense: { key: number; value: T }[] = [];
  private readonly sparse: number[] = [];

  public get size(): number {
    return this.dense.length;
  }

  public static from<T>(arrayLike: ArrayLike<T>): SparseArray<T> {
    const array = new SparseArray<T>();

    for (let i = 0; i < arrayLike.length; i++) {
      array.push(arrayLike[i]);
    }

    return array;
  }

  public get(key: number): T | null {
    const index = this.indexOf(key);

    if (index === -1) {
      return null;
    }

    return this.dense[index].value;
  }

  public delete(key: number): boolean {
    const index = this.indexOf(key);

    if (index === -1) {
      return false;
    }

    const swapped = this.dense.pop()!;

    if (swapped.key !== index) {
      this.dense[index] = swapped;
      this.sparse[swapped.key] = index;
    }

    return true;
  }

  public push(value: T): number {
    const length = this.dense.push({ key: this.sparse.length, value });

    this.sparse.push(length - 1);

    return length;
  }

  public clear(): void {
    this.dense.splice(0);
  }

  public includes(key: number): boolean {
    return this.indexOf(key) > -1;
  }

  public keyOf(value: T): number {
    const elem = this.dense.find((e) => e.value === value);

    if (elem !== undefined) {
      return elem.key;
    }

    return -1;
  }

  public forEach(
    callbackfn: (value: T, key: number, array: this) => void,
    thisArg?: unknown,
  ): void {
    this.dense.forEach(
      ({ value, key }) => callbackfn(value, key, this),
      thisArg,
    );
  }

  public *[Symbol.iterator](): Iterator<T> {
    for (const denseElement of this.dense) {
      yield denseElement.value;
    }
  }

  private indexOf(key: number): number {
    const index = this.sparse[key];

    if (index !== undefined && this.dense[index]?.key === key) {
      return index;
    }

    return -1;
  }
}
