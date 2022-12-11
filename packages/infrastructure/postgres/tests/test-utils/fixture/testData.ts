import { BankAccount, Balance, User, ActiveIncome, Job, Asset, AssetValue, AssetGroup, StockAsset } from "@finance/domain";
import { v4 } from "uuid";

export const user = new User({
	age: 21,
	firstName: "Rafael",
	lastName: "Bieze",
	identity: "rafael-bieze",
	uniqueId: v4(),
});

export const bankAccount = new BankAccount({
	bank: "ING",
	identity: "NL00INGB0000000000",
	uniqueId: v4(),
	user: user,
});
user.bankAccounts = [bankAccount]

export const niceBalance = new Balance({
	amount: 100,
	bankAccount: bankAccount,
	currency: "EUR",
	uniqueId: v4(),
});
bankAccount.balance = niceBalance;

export const activeIncome = new ActiveIncome({
	monthlySalary: 2000,
	uniqueId: v4(),
});

export const job = new Job({
	activeIncome: activeIncome,
	identity: "software-engineer-methylium",
	title: "Software Engineer",
	uniqueId: v4(),
	user: user,
});
user.jobs = [job];

export const assetGroup = new AssetGroup({
	name: "Stock Assets",
	identity: "stock-assets",
	uniqueId: v4(),
	user: user
});
user.assetGroups = [assetGroup];

export const asset = new Asset({
	identity: "asset-1",
	group: assetGroup,
	uniqueId: v4(),
	user: user,
});
assetGroup.assets = [asset]; 
user.assets = [asset];

export const stockAsset = new StockAsset({
	amount: 5,
	asset: asset,
	exchange: "NASDAQ",
	identity: "stock-asset-1",
	symbol: "GOOGL",
	uniqueId: v4(),
});
asset.stockAsset = stockAsset;

function createDates(count: number) {
	// create a list of length count contiaining dates with 10 minute intervals
	const dates = [];
	for (let i = 0; i < count; i++) {
		dates.push(new Date(new Date().getTime() - i * 10 * 60 * 1000));
	}
	return dates;
}
var dates = createDates(4);

export const assetValues = [
	new AssetValue({
		asset,
		dateTime: dates[0],
		uniqueId: v4(),
		usdValue: 69.3
	}),
	new AssetValue({
		asset,
		dateTime: dates[1],
		uniqueId: v4(),
		usdValue: 69.5
	}),
	new AssetValue({
		asset,
		dateTime: dates[2],
		uniqueId: v4(),
		usdValue: 69.7
	}),
	new AssetValue({
		asset,
		dateTime: dates[3],
		uniqueId: v4(),
		usdValue: 69.9
	}),
]
asset.valueHistory = assetValues;

export const testData = {
	User: [user],
	BankAccount: [bankAccount],
	Balance: [niceBalance],
	ActiveIncome: [activeIncome],
	Job: [job],
	AssetGroup: [assetGroup],
	Asset: [asset],
	StockAsset: [stockAsset],
	RealEstateAsset: [],
	AssetValue: [...assetValues],
} as const;