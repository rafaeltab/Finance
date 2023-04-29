import { IsString, MinLength } from "class-validator";

export class CreateRealEstateAssetBody {
	@IsString()
	@MinLength(5)
	    address!: string;
}