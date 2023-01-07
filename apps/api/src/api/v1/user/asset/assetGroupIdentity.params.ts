import { IsString, MinLength } from "class-validator";

export class AssetGroupIdentityParams {
	@IsString()
	@MinLength(5)
	assetGroupIdentity!: string;
}