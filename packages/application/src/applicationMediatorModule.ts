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
import { DeleteUserCommand } from "./commands";
import { DeleteUserCommandHandler } from "./commands/deleteUserCommand";

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

		await this.registerModule(PostgresInfrastructureModule)
	}

	async dispose() {
		await this.disposeModules();
	}
}