import { ApiParam } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class IdentityParams {
	@IsString()
	@MinLength(5)
	identity!: string;
}

export function IdentityParam() {
	return ApiParam({
		name: "identity",
		description: "Identity",
		schema: {
			type: "string",
			minLength: 5,
		}
	});
}