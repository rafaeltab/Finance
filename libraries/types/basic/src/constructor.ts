export type Constructor<T, TArgs extends undefined | unknown[] = undefined> = TArgs extends unknown[] ? new (...args: TArgs) => T : new () => T;
export type AnyConstructor<T> = new (...args: ConstructorArguments<T>[]) => T;

export type ConstructorArguments<T> = T extends {
	new(...args: infer B): unknown;
} ? B : never;