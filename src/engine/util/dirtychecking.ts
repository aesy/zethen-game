export type DirtyChecked<T extends object> = T & {
  dirty: boolean;
};

export namespace DirtyChecking {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handler: ProxyHandler<DirtyChecked<any>> = {
    set(target, property, value, receiver) {
      if (property !== "dirty") {
        target.dirty = true;
      }

      return Reflect.set(target, property, value, receiver);
    },
  };

  export function of<T extends object>(
    obj: T,
    dirtyByDefault = false,
  ): DirtyChecked<T> {
    (obj as DirtyChecked<T>).dirty = dirtyByDefault;

    return new Proxy(obj, handler);
  }
}
