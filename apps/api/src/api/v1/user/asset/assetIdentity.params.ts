import { ApiParam } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class AssetIdentityParams {
	@IsString()
	@MinLength(5)
	assetIdentity!: string;
}

export function AssetIdentityParam() {
	return ApiParam({
		name: "assetIdentity",
		description: "Asset identity",
		schema: {
			type: "string",
			minLength: 5,
		}
	});
}