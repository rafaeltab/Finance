import { IsNumber, IsString, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class CreateBankAccountBody { 
	@ApiProperty({
		type: String
	})
	@IsString()
	bank!: string;

	@ApiProperty({
		type: Number,
		minimum: 0
	})
	@IsNumber({
		maxDecimalPlaces: 2
	})
	@Min(0)
	balance!: number;

	@ApiProperty({
		type: String
	})
	@IsString()
	currency!: string;
}