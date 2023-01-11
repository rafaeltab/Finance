import { IsString, MinLength } from "class-validator";

export class CreateAssetGroupBody {
	@IsString()
	@MinLength(3)
	name!: string;
}