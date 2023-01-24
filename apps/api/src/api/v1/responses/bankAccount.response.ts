import type { BankAccount } from "@finance/domain";
import { ApiProperty,  } from "@nestjs/swagger";

export class BalanceResponse { 
	@ApiProperty({
		type: "number"
	})
	amount!: number;

	@ApiProperty({
		type: "string"
	})
	currency!: string;
}

export class BankAccountResponse { 
	@ApiProperty({
		type: "string"
	})
	bank!: string;

	@ApiProperty({
		type: BalanceResponse
	})
	balance!: BalanceResponse;

	static map(bankAccount: BankAccount): BankAccountResponse {
		return {
			balance: {
				amount: bankAccount.balance?.amount ?? 0,
				currency: bankAccount.balance?.currency ?? ""
			},
			bank: bankAccount.bank ?? ""
		}
	}
}
