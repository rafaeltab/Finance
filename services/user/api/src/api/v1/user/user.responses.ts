import type { ResponseType as UserListQueryResponseType } from "@finance/svc-user-application/build/queries/userListQuery";
import type { ResponseType as UserViewQueryResponseType } from "@finance/svc-user-application/build/queries/userViewQuery";
import type { ResponseType as CreateUserCommandResponseType } from "@finance/svc-user-application/build/commands/createUserCommand";
import { ApiProperty, IntersectionType } from "@nestjs/swagger";
import { AssetGroupResponse } from "../responses/assetGroup.response";
import { BankAccountResponse } from "../responses/bankAccount.response";
import { JobResponse } from "../responses/jobs.response";
import { PaginatedResponse, PaginatedResponseData } from "../responses/paginated.response";
import { SuccessResponse, SuccessResponseData } from "../responses/success.response";
import { UserAdditionalAssetGroups, UserAdditionalBankAccounts, UserAdditionalJobs, UserResponse } from "../responses/user.response";

class PaginatedUserResponse extends PaginatedResponse implements PaginatedResponseData<UserResponse> {
	@ApiProperty({
		type: [UserResponse],
	})
	data!: UserResponse[];
}

export class GetUsersResponse extends SuccessResponse implements SuccessResponseData<PaginatedUserResponse>{
	@ApiProperty({
		type: PaginatedUserResponse,
	})
	data!: PaginatedUserResponse;

	static map(data: UserListQueryResponseType): GetUsersResponse {
		return {
			success: data.success,
			data: {
				data: data.data.data.map(x => UserResponse.map(x)),
				page: {
					count: data.data.page.count,
					offset: data.data.page.offset,
					total: data.data.page.total
				}
			}
		}
	}
}

export class UserViewResponse extends IntersectionType(
	IntersectionType(UserResponse,
		UserAdditionalAssetGroups),
	IntersectionType(UserAdditionalBankAccounts,
		UserAdditionalJobs)) {
	static map(data: UserViewQueryResponseType): UserViewResponse { 
		return {
			...UserResponse.map(data.data),
			jobs: data.data.jobs.map(x => JobResponse.map(x)),
			assetGroups: data.data.assetGroups.map(x => AssetGroupResponse.map(x)),
			bankAccounts: data.data.bankAccounts.map(x => BankAccountResponse.map(x)),
		}
	}
}

export class InsertUserResponse { 
	@ApiProperty({
		type: "string"
	})
	userIdentity!: string;

	static map(data: CreateUserCommandResponseType): InsertUserResponse { 
		return {
			userIdentity: data.data.userIdentity
		}
	}
}