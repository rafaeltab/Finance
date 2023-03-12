import { ApiParam } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class AssetGroupIdentityParams {
	@IsString()
	@MinLength(5)
	assetGroupIdentity!: string;
}

export function AssetGroupIdentityParam() {
	return ApiParam({
		name: "assetGroupIdentity",
		description: "Asset group identity",
		schema: {
			type: "string",
			minLength: 5,
		}
	});
}