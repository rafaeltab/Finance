import { IUserRepository, User, EntityKey, PaginatedBase, UserMeta } from "@finance/domain";
import { inject } from "tsyringe";
import { UnitOfWork, unitOfWork } from "../unitOfWork/unitOfWork";
import { intersection } from "lodash"

export class UserRepository implements IUserRepository {
	constructor(@inject(unitOfWork) private _unitOfWork: UnitOfWork) { }

	async getAll(limit: number, offset: number, fields?: (keyof User)[]): Promise<PaginatedBase<User>> {
		fields = [...new Set([...(fields ?? []), "uniqueId", "identity", "firstName", "lastName", "age"])] as (keyof User)[];

		const res = await this._unitOfWork.getQueryRunner().manager
			.findAndCount(User, {
				skip: offset,
				take: limit,
				select: intersection(fields, UserMeta.data),
				relations: intersection(fields, UserMeta.relations),
			});

		return {
			page: {
				count: limit,
				offset: offset,
				total: res[1]
			},
			data: res[0]
		}
	}

	async get(id: EntityKey, fields?: (keyof User)[]): Promise<User> {
		fields = [...new Set([...(fields ?? []), "uniqueId", "identity", "firstName", "lastName", "age"])] as (keyof User)[];

		return await this._unitOfWork.getQueryRunner().manager
			.findOne(User, {
				where: id,
				select: intersection(fields, UserMeta.data),
				relations: intersection(fields, UserMeta.relations),
			});
	}

	async delete(id: EntityKey): Promise<void> {
		await this._unitOfWork.getQueryRunner().manager.delete(User, id);
	}
}