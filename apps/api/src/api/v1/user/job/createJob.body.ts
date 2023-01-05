import { IsNumber, IsString } from "class-validator";


export class CreateJobBody { 
	@IsString()
	
	title!: string;

	@IsNumber()
	monthlySalary!: number;
}