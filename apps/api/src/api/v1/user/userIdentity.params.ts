import { IsString } from "class-validator";

export class UserIdentityParams {
	@IsString()
	userIdentity!: string;
}