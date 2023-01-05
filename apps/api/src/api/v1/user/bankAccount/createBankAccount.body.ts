import { IsNumber, IsString, IsISO4217CurrencyCode } from "class-validator";


export class CreateBankAccountBody { 
	@IsString()
	
	bank!: string;

	@IsNumber({
		maxDecimalPlaces: 2
	})
	balance!: number;

	@IsISO4217CurrencyCode()
	currency!: string;
}