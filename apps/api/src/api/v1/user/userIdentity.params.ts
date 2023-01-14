import { ApiParam } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class UserIdentityParams {
	@IsString()
	@MinLength(5)
	userIdentity!: string;
}

export function UserIdentityParam() { 
	return ApiParam({
		name: "userIdentity",
		description: "User identity",
		schema: {
			type: "string",
			minLength: 5,
		}
	});
}