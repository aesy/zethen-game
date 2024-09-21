export function equals<T>(value: T): (element: T) => element is T {
  return (element: T): element is T => {
    return element === value;
  };
}

export function notNull<T>(element: T | null): element is T {
  return element !== null;
}

export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
