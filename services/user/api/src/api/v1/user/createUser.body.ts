import { IsDateString, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class CreateUserBody {
	@ApiProperty()
	@IsString()
	    firstName!: string;

	@ApiProperty()
	@IsString()
	    lastName!: string;

	@ApiProperty()
	@IsDateString()
	    dateOfBirth!: string;
}