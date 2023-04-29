import type { BankAccount } from "@finance/svc-user-domain";
import { ApiProperty,  } from "@nestjs/swagger";
import { EntityResponse } from "./identity.response";

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

export class BankAccountResponse extends EntityResponse { 
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
	        bank: bankAccount.bank ?? "",
	        identity: bankAccount.identity
	    }
	}
}
