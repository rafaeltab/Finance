import type { OptionalReadonly } from "@finance/lib-basic-types";

export type WithRequiredProperty<Type, Key extends keyof Type> = Type & {
	[Property in Key]-?: Type[Property];
};

export function assertContains<TObj extends object, TFields extends keyof TObj>(obj: TObj, fields: OptionalReadonly<TFields[]>)
	: asserts obj is WithRequiredProperty<TObj, TFields> { 
    for (const field of fields) {
        if (field in obj) continue;

        throw new Error(`Object does not contain field ${String(field)}`);
    }
}