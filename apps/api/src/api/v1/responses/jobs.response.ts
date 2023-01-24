import type { Job } from "@finance/domain";
import { ApiProperty } from "@nestjs/swagger";

export class ActiveIncomeResponse { 
	@ApiProperty({
		type: "number"
	})
	monthlySalary!: number;
}

export class JobResponse { 
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
			title: job.title ?? ""
		}
	}
}
