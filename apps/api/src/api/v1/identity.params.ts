import { IsString, MinLength } from "class-validator";

export class IdentityParams {
	@IsString()
	@MinLength(5)
	identity!: string;
}