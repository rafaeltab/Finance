import type { Job } from "@finance/svc-user-domain";
import { ApiProperty } from "@nestjs/swagger";
import { EntityResponse } from "./identity.response";

export class ActiveIncomeResponse { 
	@ApiProperty({
		type: "number"
	})
	monthlySalary!: number;
}

export class JobResponse extends EntityResponse { 
	@ApiProperty({
		type: "string"
	})
	title!: string;
	
	@ApiProperty({
		type: ActiveIncomeResponse
	})
	activeIncome!: ActiveIncomeResponse;

	static map(job: Job): JobResponse {
		return {
			activeIncome: {
				monthlySalary: job.activeIncome?.monthlySalary ?? 0
			},
			title: job.title ?? "",
			identity: job.identity
		}
	}
}
