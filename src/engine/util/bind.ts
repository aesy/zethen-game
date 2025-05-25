export function bind(
  _originalMethod: unknown,
  context: ClassMethodDecoratorContext,
) {
  const methodName = context.name;

  if (context.private) {
    throw new Error(
      `'bind@' cannot decorate private properties like ${methodName as string}.`,
    );
  }

  context.addInitializer(function () {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this[methodName] = this[methodName].bind(this);
  });
}
