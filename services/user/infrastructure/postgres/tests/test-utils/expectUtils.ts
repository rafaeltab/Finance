import { assert } from "console";

export function expectNotNullOrUndefined<T extends any>(toCheck: T): asserts toCheck is Exclude<T, undefined | null> {
	expect(toCheck).not.toBeUndefined();
	expect(toCheck).not.toBeNull();

	assert(toCheck !== undefined && toCheck !== null);
}

export function expectNotEmpty<T extends string | undefined | null>(toCheck: T): asserts toCheck is Exclude<T, undefined | null | ""> {
	expect(toCheck).not.toBeUndefined();
	expect(toCheck).not.toBeNull();

	assert(toCheck !== undefined && toCheck !== null);

	expect((toCheck as string).trim()).not.toBe("");
}

type RequiredProps<T, Props extends keyof T> = { [P in Props]-?: T[P]; }

export function expectRequiredProps<T extends {
	[F in P]?: T[P] | undefined;
}, P extends keyof T>(obj: T, fields: P[]): asserts obj is T & RequiredProps<T, P> {
	for (const field of fields) {
		expectNotNullOrUndefined(obj[field]);
	}
}
