// list a maximum of 30 asset groups

import { IUserRepository, User, PaginatedBase, userRepositoryToken } from "@finance/svc-user-domain";
import { IQuery, IQueryHandler, IQueryResult } from "@finance/lib-mediator";
import { IUnitOfWork, unitOfWorkToken } from "@finance/svc-user-infra-postgres";
import { inject, injectable } from "tsyringe";

export type ResponseType = IQueryResult<{
	isEmpty: boolean
} & PaginatedBase<User>>

export class UserListQuery extends IQuery<UserListQuery, ResponseType> {
    token = "UserListQuery";

    limit = 30;

    offset = 0;
}

@injectable()
export class UserListQueryHandler extends IQueryHandler<UserListQuery, ResponseType> {
    constructor(
		@inject(userRepositoryToken) private userRepository: IUserRepository,
		@inject(unitOfWorkToken) private unitOfWork: IUnitOfWork
    ) {
        super();
    }

    async handle(query: UserListQuery): Promise<ResponseType> {
        try {
            await this.unitOfWork.start();

            const users = await this.userRepository.getAll(query.limit, query.offset);

            await this.unitOfWork.commit();

            return {
                success: true,
                data: {
                    page: {
                        count: users.page.count,
                        offset: users.page.offset,
                        total: users.page.total,
                    },
                    data: users.data,
                    isEmpty: users.page.total === 0,
                }
            }
        } catch (e: unknown) {
            await this.unitOfWork.rollback();
            throw e;
        }
    }
}