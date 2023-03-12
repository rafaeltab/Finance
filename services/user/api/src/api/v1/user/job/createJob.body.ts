import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, Min } from "class-validator";


export class CreateJobBody { 
	
	@ApiProperty({
		type: String
	})
	@IsString()	
	title!: string;
	
	@ApiProperty({
		type: Number,
		minimum: 0
	})
	@IsNumber()
	@Min(0)
	monthlySalary!: number;
}