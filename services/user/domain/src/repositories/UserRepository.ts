import type { InjectionToken } from "tsyringe";
import type { FindOptionsRelations } from "typeorm";
import type { User } from "../aggregates/User";
import type { EntityKey } from "../utils";
import type { PaginatedBase } from "../utils/PaginatedBase";

export const userRepository: InjectionToken = "IUserRepository";

export interface IUserRepository {
	getAll(limit: number, offset: number, fields?: (keyof User)[]): Promise<PaginatedBase<User>>;

	get(id: EntityKey, fields?: (keyof User)[]): Promise<User>;
	getRelations(id: EntityKey, relations: FindOptionsRelations<User>): Promise<User>;

	delete(id: EntityKey): Promise<void>;
}