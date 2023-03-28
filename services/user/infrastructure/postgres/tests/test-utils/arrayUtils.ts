import { UnexpectedError } from "@finance/lib-errors";
import type { ValueObjectBase } from "@finance/svc-user-domain";

export function identityEquals<T extends ValueObjectBase>(resultA: PossibleReadonly<T>, resultB: PossibleReadonly<T>): boolean {
	if (!("identity" in resultA && "identity" in resultB)) { 
		return false;
	}	
	
	if (resultA.identity !== resultB.identity) return false;
	return resultA.uniqueId === resultB.uniqueId;
}

export function arrayIdentityEquals<T extends ValueObjectBase>(resultA: PossibleReadonlyArray<T>, resultB: PossibleReadonlyArray<T>): boolean {
	if (resultA.length !== resultB.length) return false;

	for (let i = 0; i < resultA.length; i += 1) {
		const resA = resultA[i];
		const resB = resultB[i];

		if (resA === undefined || resB === undefined) { 
			throw new UnexpectedError("Unexpected undefined");
		}

		if (!identityEquals(resA, resB)) return false;
	}

	return true;
}

export function createDates(count: number) {
	// create a list of length count contiaining dates with 10 minute intervals
	const dates = [];
	for (let i = 0; i < count; i += 1) {
		dates.push(new Date(new Date().getTime() - i * 10 * 60 * 1000));
	}
	return dates;
}

type PossibleReadonlyArray<T> = PossibleReadonly<T>[] | Readonly<PossibleReadonly<T>[]>
type PossibleReadonly<T> = T | Readonly<T>;