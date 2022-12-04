import { Asset, AssetMeta } from "./Asset";
import { AssetValue, AssetValueMeta } from "./Value";
import { RealEstateAsset, RealEstateAssetMeta } from "./assetKinds/RealEstateAsset";
import { StockAsset, StockAssetMeta } from "./assetKinds/StockAsset";

export default Asset;

export {
	AssetValue,
	RealEstateAsset,
	StockAsset,
	AssetMeta,
	AssetValueMeta,
	RealEstateAssetMeta,
	StockAssetMeta
}