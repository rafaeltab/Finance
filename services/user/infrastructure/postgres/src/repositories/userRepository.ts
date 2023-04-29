import { IUserRepository, User, EntityKey, PaginatedBase, UserMeta, getKey } from "@finance/svc-user-domain";
import { inject, injectable } from "tsyringe";
import { intersection } from "lodash-es"
import type { FindOptionsRelations } from "typeorm";
import { EntryNotFoundError } from "@finance/lib-errors";
import { UnitOfWork, unitOfWorkToken } from "../unitOfWork/unitOfWork";

@injectable()
export class UserRepository implements IUserRepository {
    constructor(@inject(unitOfWorkToken) private unitOfWork: UnitOfWork) { }

    async getAll(limit: number, offset: number, fields?: (keyof User)[]): Promise<PaginatedBase<User>> {
        const entityFields = [...new Set([...(fields ?? []), "uniqueId", "identity", "firstName", "lastName", "dateOfBirth"])] as (keyof User)[];

        const res = await this.unitOfWork.getQueryRunner().manager
            .findAndCount(User, {
                skip: offset,
                take: limit,
                select: intersection(entityFields, UserMeta.data),
                relations: intersection(entityFields, UserMeta.relations),
            });

        return {
            page: {
                count: limit,
                offset,
                total: res[1]
            },
            data: res[0]
        }
    }

    async get(id: EntityKey, fields?: (keyof User)[]): Promise<User> {
        const entityFields = [...new Set([...(fields ?? []), "uniqueId", "identity", "firstName", "lastName", "dateOfBirth"])] as (keyof User)[];

        const user = await this.unitOfWork.getQueryRunner().manager
            .findOne(User, {
                where: id,
                select: intersection(entityFields, UserMeta.data),
                relations: intersection(entityFields, UserMeta.relations)
            });
		
        if (!user) {
            throw new EntryNotFoundError(User.name, getKey(id));
        }
		
        return user;
    }

    async getRelations(id: EntityKey, relations: FindOptionsRelations<User>): Promise<User> {
        const user = await this.unitOfWork.getQueryRunner().manager
            .findOne(User, {
                where: id,
                relations
            });
		
        if (!user) {
            throw new EntryNotFoundError(User.name, getKey(id));
        }

        return user;
    }

    async delete(id: EntityKey): Promise<void> {
        const res = await this.unitOfWork.getQueryRunner().manager.delete(User, id);
        if ((res.affected ?? 0)===0) { 
            throw new EntryNotFoundError(User.name, getKey(id));
        } 
    }
}