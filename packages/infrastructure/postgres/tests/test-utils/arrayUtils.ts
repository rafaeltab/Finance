import { ValueObjectBase } from "@finance/domain";

export function identityEquals<T extends ValueObjectBase>(resultA: PossibleReadonly<T>, resultB: PossibleReadonly<T>): boolean {
	if ((resultA as any).identity !== (resultB as any).identity) return false;
	return resultA.uniqueId === resultB.uniqueId;
}

export function arrayIdentityEquals<T extends ValueObjectBase>(resultA: PossibleReadonlyArray<T>, resultB: PossibleReadonlyArray<T>): boolean {
	if (resultA.length !== resultB.length) return false;

	for (let i = 0; i < resultA.length; i++) {
		if (!identityEquals(resultA[i], resultB[i])) return false;
	}

	return true;
}

type PossibleReadonlyArray<T> = PossibleReadonly<T>[] | Readonly<PossibleReadonly<T>[]>
type PossibleReadonly<T> = T | Readonly<T>;