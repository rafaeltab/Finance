import type { ResponseType as BankAccountsViewQueryResponse } from "@finance/svc-user-application/build/queries/bankAccountViewQuery";
import type { ResponseType as CreateBankAccountCommandResponse } from "@finance/svc-user-application/build/commands/createBankAccountCommand";

import { ApiProperty } from "@nestjs/swagger";
import { BankAccountResponse } from "../../responses/bankAccount.response";
import { PaginatedResponse, type PaginatedResponseData } from "../../responses/paginated.response";
import { SuccessResponse, type SuccessResponseData } from "../../responses/success.response";

class PaginatedBankAccountResponse extends PaginatedResponse implements PaginatedResponseData<BankAccountResponse> {
	@ApiProperty({
		type: [BankAccountResponse],
	})
	data!: BankAccountResponse[];
}
export class BankAccountsViewResponse extends SuccessResponse implements SuccessResponseData<PaginatedBankAccountResponse> {
	@ApiProperty({
		type: PaginatedBankAccountResponse
	})
	data!: PaginatedBankAccountResponse;

	static map(bankAccounts: BankAccountsViewQueryResponse): BankAccountsViewResponse {
		return {
			success: true,
			data: {
				page: {
					count: bankAccounts.data.page.count,
					offset: bankAccounts.data.page.offset,
					total: bankAccounts.data.page.total
				},
				data: bankAccounts.data.data.map(BankAccountResponse.map)
			}
		}
	}
}

// Create a response for the createBankAccountCommand
export class CreateBankAccountResponse extends SuccessResponse implements SuccessResponseData<BankAccountResponse> {
	@ApiProperty({
		type: BankAccountResponse
	})
	data!: BankAccountResponse;

	static map(bankAccount: CreateBankAccountCommandResponse): CreateBankAccountResponse {
		return {
			success: true,
			data: BankAccountResponse.map(bankAccount.data)
		}
	}
}