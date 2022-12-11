import * as assetAggregate from "./assetAggregate";
import * as jobAggregate from "./jobAggregrate";
import * as bankAccountAggregate from "./bankAccountAggregate";
import { AssetGroup } from "./AssetGroup";
import { User } from "./User";

const Asset = assetAggregate.default;
const Job = jobAggregate.default;
const BankAccount = bankAccountAggregate.default;

export { 
	User,
	AssetGroup
}

export const entities = [
	Asset,
	assetAggregate.AssetValue,
	assetAggregate.RealEstateAsset,
	assetAggregate.StockAsset,
	assetAggregate.StockOrder,

	Job,
	jobAggregate.ActiveIncome,

	BankAccount,
	bankAccountAggregate.Balance,

	AssetGroup,
	User
];

export * from "./User";
export * from "./AssetGroup";
export * from "./assetAggregate";
export * from "./jobAggregrate";
export * from "./bankAccountAggregate";