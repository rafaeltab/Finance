import { MediatorModule } from "@finance/libs-types";
import { GetAssetGroupsQuery, GetAssetGroupsQueryHandler } from "./queries/getAssetGroupsQuery";
import { GetAssetsForAssetGroupQuery, GetAssetsForAssetGroupQueryHandler } from "./queries/getAssetsForAssetGroupQuery";
import { JobViewQuery, JobViewQueryHandler } from "./queries/jobViewQuery";
import { BankAccountViewQuery, BankAccountViewQueryHandler } from "./queries/bankAccountViewQuery";
import { StocksDataListViewQuery, StocksDataListViewQueryHandler } from "./queries/stocksDataListViewQuery";
import { StockDataViewQuery, StockDataViewQueryHandler } from "./queries/stockDataViewQuery";
import { PostgresInfrastructureModule } from "@finance/postgres";
import { StockDataSearchQuery, StockDataSearchQueryHandler } from "./queries/stockDataSearchQuery";
import { UserListQuery, UserListQueryHandler } from "./queries/userListQuery";
import { UserViewQuery, UserViewQueryHandler } from "./queries/userViewQuery";
import { CreateUserCommand, CreateUserCommandHandler } from "./commands/createUserCommand";
import { DeleteUserCommand, DeleteUserCommandHandler } from "./commands/deleteUserCommand";
import { CreateJobCommand, CreateJobCommandHandler } from "./commands/createJobCommand";
import { DeleteJobCommand, DeleteJobCommandHandler } from "./commands/deleteJobCommand";
import { DeleteBankAccountCommand, DeleteBankAccountCommandHandler } from "./commands/deleteBankAccountCommand";
import { CreateBankAccountCommand, CreateBankAccountCommandHandler } from "./commands/createBankAccountCommand";

export class ApplicationMediatorModule extends MediatorModule {
	async register(): Promise<void> {
		this.registerQuery(GetAssetGroupsQuery, GetAssetGroupsQueryHandler);
		this.registerQuery(GetAssetsForAssetGroupQuery, GetAssetsForAssetGroupQueryHandler);
		this.registerQuery(JobViewQuery, JobViewQueryHandler);
		this.registerQuery(BankAccountViewQuery, BankAccountViewQueryHandler);
		this.registerQuery(StocksDataListViewQuery, StocksDataListViewQueryHandler);
		this.registerQuery(StockDataViewQuery, StockDataViewQueryHandler);
		this.registerQuery(StockDataSearchQuery, StockDataSearchQueryHandler);
		this.registerQuery(UserListQuery, UserListQueryHandler);
		this.registerQuery(UserViewQuery, UserViewQueryHandler);

		this.registerCommand(CreateUserCommand, CreateUserCommandHandler);
		this.registerCommand(DeleteUserCommand, DeleteUserCommandHandler);
		this.registerCommand(CreateJobCommand, CreateJobCommandHandler);
		this.registerCommand(DeleteJobCommand, DeleteJobCommandHandler);
		this.registerCommand(CreateBankAccountCommand, CreateBankAccountCommandHandler);
		this.registerCommand(DeleteBankAccountCommand, DeleteBankAccountCommandHandler);

		await this.registerModule(PostgresInfrastructureModule)
	}

	async dispose() {
		await this.disposeModules();
	}
}