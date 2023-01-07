import { IsString, MinLength } from "class-validator";

export class AssetIdentityParams {
	@IsString()
	@MinLength(5)
	assetIdentity!: string;
}