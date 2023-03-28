export type Constructor<T, TArgs extends undefined | unknown[] = undefined> = TArgs extends unknown[] ? new (...args: TArgs) => T : new () => T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyConstructor<T> = new (...args: any[]) => T;

export type ConstructorArguments<T> = T extends {
	new(...args: infer B): unknown;
} ? B : never;