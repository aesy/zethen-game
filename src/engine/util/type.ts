export type Constructor<T> = Function & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): T;
  prototype: T;
};

export type RecursiveReadonly<T> = {
  readonly [P in keyof T]: Readonly<T[P]>;
};
