import { ApiProperty } from "@nestjs/swagger";
import type { User } from "@finance/svc-user-domain";
import { DateTime } from "luxon";
import { AssetGroupResponse } from "./assetGroup.response";
import { AssetResponse } from "./asset.response";
import { BankAccountResponse } from "./bankAccount.response";
import { JobResponse } from "./jobs.response";
import { EntityResponse } from "./identity.response";

export class UserResponse extends EntityResponse { 
	@ApiProperty({
	    type: "string",
	    format: "date"
	})
	    dateOfBirth!: string;

	@ApiProperty({
	    type: "string"
	})
	    firstName!: string;

	@ApiProperty({
	    type: "string"
	})
	    lastName!: string;

	static map(user: User): UserResponse { 
	    return {
	        dateOfBirth: user.dateOfBirth ? DateTime.fromJSDate(user.dateOfBirth).toFormat("yyyy-MM-dd") : "",
	        firstName: user.firstName ?? "",
	        lastName: user.lastName ?? "",
	        identity: user.identity
	    }
	}
}

export class UserAdditionalAssetGroups {
	@ApiProperty({
	    type: [AssetGroupResponse]
	})
	    assetGroups!: AssetGroupResponse[]
}

export class UserAdditionalAssets { 
	@ApiProperty({
	    type: [AssetResponse]
	})
	    assets!: AssetResponse[];
}

export class UserAdditionalBankAccounts { 
	@ApiProperty({
	    type: [BankAccountResponse]
	})
	    bankAccounts!: BankAccountResponse[]
}

export class UserAdditionalJobs { 
	@ApiProperty({
	    type: [JobResponse]
	})
	    jobs!: JobResponse[];
}