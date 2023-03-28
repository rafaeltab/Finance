import { BankAccount, Balance, User, ActiveIncome, Job, Asset, AssetGroup, StockAsset, StockOrder, StockData, StockAssetKind, StockValue, StockSplitEvent, StockDividendEvent } from "@finance/svc-user-domain";
import { v4 } from "uuid";
import { createDates } from "../arrayUtils";

export const user = new User({
	dateOfBirth: new Date("2001-02-27"),
	firstName: "Rafael",
	lastName: "Bieze",
	identity: "rafael-bieze",
	uniqueId: v4(),
});

export const bankAccount = new BankAccount({
	bank: "ING",
	identity: "NL00INGB0000000000",
	uniqueId: v4(),
	user,
});
user.bankAccounts = [bankAccount]

export const niceBalance = new Balance({
	amount: 100,
	bankAccount,
	currency: "EUR",
	uniqueId: v4(),
});
bankAccount.balance = niceBalance;

export const activeIncome = new ActiveIncome({
	monthlySalary: 2000,
	uniqueId: v4(),
});

export const job = new Job({
	activeIncome,
	identity: "software-engineer-methylium",
	title: "Software Engineer",
	uniqueId: v4(),
	user,
});
user.jobs = [job];

export const googlStockData = new StockData({
	assetKind: StockAssetKind.CS,
	identity: "goog-nasdaq-stock-data",
	uniqueId: v4(),
	exchange: "NASDAQ",
	symbol: "GOOGL",
});

const dates = createDates(6);
export const googStockValues = [
	new StockValue({
		stockData: googlStockData,
		date: dates[0],
		uniqueId: v4(),
		close: 69.9,
		high: 70.1,
		low: 69.1,
		open: 69.3,
		volume: 1000,
	}),
	new StockValue({
		stockData: googlStockData,
		date: dates[1],
		uniqueId: v4(),
		close: 67.7,
		high: 69.9,
		low: 65.6,
		open: 69.9,
		volume: 1000,
	}),
	new StockValue({
		stockData: googlStockData,
		date: dates[2],
		uniqueId: v4(),
		close: 69.3,
		high: 70.8,
		low: 67.7,
		open: 67.7,
		volume: 1000,
	}),
	new StockValue({
		stockData: googlStockData,
		date: dates[3],
		uniqueId: v4(),
		close: 69.5,
		high: 69.7,
		low: 64.3,
		open: 69.3,
		volume: 1000,
	}),
];

export const stockSplitEvent = new StockSplitEvent({
	date: dates[4],
	stockData: googlStockData,
	uniqueId: v4(),
	ratio: 2,
})

export const stockDividendEvent = new StockDividendEvent({
	date: dates[5],
	stockData: googlStockData,
	uniqueId: v4(),
	amount: 0.052
});
googlStockData.dividendsEvents = [stockDividendEvent];
googlStockData.splitEvents = [stockSplitEvent];
googlStockData.values = googStockValues;

export const assetGroup = new AssetGroup({
	name: "Stock Assets",
	identity: "stock-assets",
	uniqueId: v4(),
	user
});
user.assetGroups = [assetGroup];

export const asset = new Asset({
	identity: "asset-1",
	group: assetGroup,
	uniqueId: v4(),
	user,
});
assetGroup.assets = [asset];
user.assets = [asset];

export const stockAsset = new StockAsset({
	asset,
	identity: "stock-asset-1",
	uniqueId: v4(),
	stockData: googlStockData,
});

export const stockOrders = [
	new StockOrder({
		amount: 10,
		usdPrice: 89.3,
		stockAsset,
		uniqueId: v4(),
	})
]
stockAsset.orders = stockOrders;

export const stockOrder = new StockOrder({
	amount: 10,
	usdPrice: 89.3,
	stockAsset,
	uniqueId: v4(),
});
stockAsset.orders = [stockOrder];
asset.stockAsset = stockAsset;


export const testData = {
	User: [user],
	BankAccount: [bankAccount],
	Balance: [niceBalance],
	ActiveIncome: [activeIncome],
	Job: [job],
	AssetGroup: [assetGroup],
	Asset: [asset],
	StockData: [googlStockData],
	RealEstateAsset: [],
	StockAsset: [stockAsset],
	StockValue: [...googStockValues],
	StockSplitEvent: [stockSplitEvent],
	StockDividendEvent: [stockDividendEvent],
	StockOrder: [stockOrder],
} as const;