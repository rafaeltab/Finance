import { ApiProperty } from "@nestjs/swagger";
import { AssetResponse } from "./asset.response";
import type { AssetGroup } from "@finance/domain";
import { EntityResponse } from "./identity.response";

export class AssetGroupResponse extends EntityResponse { 
	@ApiProperty({
		type: "string"
	})
	name!: string;

	@ApiProperty({
		type: [AssetResponse]
	})
	assets!: AssetResponse[];

	static map(assetGroup: AssetGroup): AssetGroupResponse { 
		return {
			name: assetGroup.name ?? "",
			assets: (assetGroup.assets ?? []).map(AssetResponse.map),
			identity: assetGroup.identity
		}
	}
}