import { IsNumber, IsString, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class CreateBankAccountBody { 
	@ApiProperty()
	@IsString()
	bank!: string;

	@ApiProperty()
	@IsNumber({
		maxDecimalPlaces: 2
	})
	@Min(0)
	balance!: number;

	@ApiProperty()
	@IsString()
	currency!: string;
}