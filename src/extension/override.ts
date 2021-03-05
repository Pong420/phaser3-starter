// eslint-disable-next-line @typescript-eslint/ban-types
export function overrideHelper() {
  const callbacks: (() => void)[] = [];

  function override<
    F extends { prototype: any },
    I extends F['prototype'],
    K extends keyof I,
    Fn extends (this: I, ...args: Parameters<I[K]>) => ReturnType<I[K]>
  >(classes: F, object: Record<K, (defaultFn: Fn) => Fn>) {
    for (const methodName in object) {
      const overrideFunction = object[methodName];
      const defaultFn = classes.prototype[methodName];

      classes.prototype[methodName] = overrideFunction(defaultFn);

      callbacks.push(() => {
        classes.prototype[methodName] = defaultFn;
      });
    }
  }

  return { override, resetOverride: () => callbacks.forEach(reset => reset()) };
}
