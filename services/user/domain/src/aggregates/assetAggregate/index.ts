import { Asset, AssetMeta } from "./Asset";
import { RealEstateAsset, RealEstateAssetMeta } from "./assetKinds/RealEstateAsset";
import { StockAsset, StockAssetMeta } from "./assetKinds/StockAsset";
import { StockOrder, StockOrderMeta } from "./assetKinds/StockOrder";

export default Asset;

export {
    Asset,
    RealEstateAsset,
    StockAsset,
    StockOrder,
    AssetMeta,
    RealEstateAssetMeta,
    StockAssetMeta,
    StockOrderMeta
}