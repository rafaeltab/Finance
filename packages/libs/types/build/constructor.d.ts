export type Constructor<T, TArgs extends undefined | any[] = undefined> = TArgs extends any[] ? new (...args: TArgs) => T : new () => T;
export type AnyConstructor<T> = Constructor<T, any[]>;
