import { MediatorModule } from "@finance/libs-types";
import { PostgresInfrastructureModule } from "@finance/postgres";
import { CreateRealEstateAssetForAssetGroupCommand, CreateRealEstateAssetForAssetGroupCommandHandler } from "./commands/assets/createRealEstateAssetForAssetGroupCommand";
import { CreateBankAccountCommand, CreateBankAccountCommandHandler } from "./commands/createBankAccountCommand";
import { CreateJobCommand, CreateJobCommandHandler } from "./commands/createJobCommand";
import { CreateUserCommand, CreateUserCommandHandler } from "./commands/createUserCommand";
import { DeleteBankAccountCommand, DeleteBankAccountCommandHandler } from "./commands/deleteBankAccountCommand";
import { DeleteJobCommand, DeleteJobCommandHandler } from "./commands/deleteJobCommand";
import { DeleteUserCommand, DeleteUserCommandHandler } from "./commands/deleteUserCommand";
import { GetAssetGroupQuery, GetAssetGroupQueryHandler } from "./queries/assets/getAssetGroupQuery";
import { GetAssetGroupsForUserQuery, GetAssetGroupsForUserQueryHandler } from "./queries/assets/getAssetGroupsForUserQuery";
import { GetAssetQuery, GetAssetQueryHandler } from "./queries/assets/getAssetQuery";
import { GetAssetsForUserQuery, GetAssetsForUserQueryHandler } from "./queries/assets/getAssetsForUserQuery";
import { BankAccountViewQuery, BankAccountViewQueryHandler } from "./queries/bankAccountViewQuery";
import { JobViewQuery, JobViewQueryHandler } from "./queries/jobViewQuery";
import { StockDataSearchQuery, StockDataSearchQueryHandler } from "./queries/stockDataSearchQuery";
import { StockDataViewQuery, StockDataViewQueryHandler } from "./queries/stockDataViewQuery";
import { StocksDataListViewQuery, StocksDataListViewQueryHandler } from "./queries/stocksDataListViewQuery";
import { UserListQuery, UserListQueryHandler } from "./queries/userListQuery";
import { UserViewQuery, UserViewQueryHandler } from "./queries/userViewQuery";
import { CreateRealEstateAssetForUserCommand, CreateRealEstateAssetForUserCommandHandler } from "./commands/assets/createRealEstateAssetForUserCommand";
import { CreateStockAssetForAssetGroupCommand, CreateStockAssetForAssetGroupCommandHandler } from "./commands/assets/createStockAssetForAssetGroupCommand";
import { CreateStockAssetForUserCommand, CreateStockAssetForUserCommandHandler } from "./commands/assets/createStockAssetForUserCommand";
import { DeleteAssetCommand, DeleteAssetCommandHandler } from "./commands/assets/deleteAssetCommand";
import { DeleteAssetGroupCommand, DeleteAssetGroupCommandHandler } from "./commands/assets/deleteAssetGroupCommand";
import { CreateStockDatasCommand, CreateStockDatasCommandHandler } from "./commands/createStockDatasCommand";
import { AddValuesToStockDataCommand, AddValuesToStockDataCommandHandler } from "./commands/addValuesToStockDataCommand";
import { CreateAssetGroupForUserCommand, CreateAssetGroupForUserCommandHandler } from "./commands/assets/createAssetGroupForUserCommand";

export class ApplicationMediatorModule extends MediatorModule {
	async register(): Promise<void> {
		this.registerQuery(GetAssetGroupsForUserQuery, GetAssetGroupsForUserQueryHandler);
		this.registerQuery(GetAssetGroupQuery, GetAssetGroupQueryHandler);
		this.registerQuery(JobViewQuery, JobViewQueryHandler);
		this.registerQuery(BankAccountViewQuery, BankAccountViewQueryHandler);
		this.registerQuery(StocksDataListViewQuery, StocksDataListViewQueryHandler);
		this.registerQuery(StockDataViewQuery, StockDataViewQueryHandler);
		this.registerQuery(StockDataSearchQuery, StockDataSearchQueryHandler);
		this.registerQuery(UserListQuery, UserListQueryHandler);
		this.registerQuery(UserViewQuery, UserViewQueryHandler);
		this.registerQuery(GetAssetQuery, GetAssetQueryHandler);
		this.registerQuery(GetAssetsForUserQuery, GetAssetsForUserQueryHandler);

		this.registerCommand(CreateUserCommand, CreateUserCommandHandler);
		this.registerCommand(DeleteUserCommand, DeleteUserCommandHandler);
		this.registerCommand(CreateJobCommand, CreateJobCommandHandler);
		this.registerCommand(DeleteJobCommand, DeleteJobCommandHandler);
		this.registerCommand(CreateBankAccountCommand, CreateBankAccountCommandHandler);
		this.registerCommand(DeleteBankAccountCommand, DeleteBankAccountCommandHandler);
		this.registerCommand(CreateRealEstateAssetForAssetGroupCommand, CreateRealEstateAssetForAssetGroupCommandHandler);
		this.registerCommand(CreateRealEstateAssetForUserCommand, CreateRealEstateAssetForUserCommandHandler);
		this.registerCommand(CreateStockAssetForAssetGroupCommand, CreateStockAssetForAssetGroupCommandHandler);
		this.registerCommand(CreateStockAssetForUserCommand, CreateStockAssetForUserCommandHandler);
		this.registerCommand(DeleteAssetCommand, DeleteAssetCommandHandler);
		this.registerCommand(DeleteAssetGroupCommand, DeleteAssetGroupCommandHandler);
		this.registerCommand(CreateStockDatasCommand, CreateStockDatasCommandHandler);
		this.registerCommand(AddValuesToStockDataCommand, AddValuesToStockDataCommandHandler);
		this.registerCommand(CreateAssetGroupForUserCommand, CreateAssetGroupForUserCommandHandler);

		await this.registerModule(PostgresInfrastructureModule)
	}

	async dispose() {
		await this.disposeModules();
	}
}