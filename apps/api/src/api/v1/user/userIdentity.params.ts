import { IsString, MinLength } from "class-validator";

export class UserIdentityParams {
	@IsString()
	@MinLength(5)
	userIdentity!: string;
}