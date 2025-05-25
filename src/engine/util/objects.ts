export namespace Objects {
  export function deepEquals(a: unknown, b: unknown): boolean {
    if (a === b) {
      return true;
    }

    if (a == null || b == null) {
      return false;
    }

    if (typeof a === "object" && typeof b === "object") {
      if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
          return false;
        }

        return a.every((item, index) => deepEquals(item, b[index]));
      }

      const keysA = Object.keys(a as object);
      const keysB = Object.keys(b as object);

      if (keysA.length !== keysB.length) {
        return false;
      }

      return keysA.every(
        (key) =>
          Object.prototype.hasOwnProperty.call(b, key) &&
          deepEquals(
            (a as Record<string, unknown>)[key],
            (b as Record<string, unknown>)[key],
          ),
      );
    }

    return false;
  }

  export function partiallyEquals(a: unknown, b: unknown): boolean {
    if (a === b) {
      return true;
    }

    if (a == null || b == null) {
      return false;
    }

    if (typeof a === "object" && typeof b === "object") {
      if (Array.isArray(a) && Array.isArray(b)) {
        return a.every((item, index) => partiallyEquals(item, b[index]));
      }

      const keysA = Object.keys(a as object);

      return keysA.every(
        (key) =>
          Object.prototype.hasOwnProperty.call(b, key) &&
          partiallyEquals(
            (a as Record<string, unknown>)[key],
            (b as Record<string, unknown>)[key],
          ),
      );
    }

    return false;
  }
}
