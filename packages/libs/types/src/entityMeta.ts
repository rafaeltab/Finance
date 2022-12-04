export type EntityMeta<T> = {
	relations: (keyof T)[],
	data: (keyof T)[]
}