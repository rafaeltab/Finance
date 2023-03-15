import * as assetAggregate from "./assetAggregate";
import * as jobAggregate from "./jobAggregrate";
import * as bankAccountAggregate from "./bankAccountAggregate";
import * as stockAggregate from "./stockAggregate";
import { AssetGroup } from "./AssetGroup";
import { User } from "./User";

const Asset = assetAggregate.default;
const Job = jobAggregate.default;
const BankAccount = bankAccountAggregate.default;
const StockData = stockAggregate.default;

export const entities = [
	Asset,
	assetAggregate.RealEstateAsset,
	assetAggregate.StockAsset,
	assetAggregate.StockOrder,

	Job,
	jobAggregate.ActiveIncome,

	BankAccount,
	bankAccountAggregate.Balance,

	StockData,
	stockAggregate.StockValue,
	stockAggregate.StockSplitEvent,
	stockAggregate.StockDividendEvent,

	AssetGroup,
	User
];

export * from "./User";
export * from "./AssetGroup";
export * from "./assetAggregate";
export * from "./jobAggregrate";
export * from "./bankAccountAggregate";
export * from "./stockAggregate";