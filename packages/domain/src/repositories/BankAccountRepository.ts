import { InjectionToken } from "tsyringe";
import BankAccount from "../aggregates/bankAccountAggregate";
import { EntityKey } from "../utils";
import { PaginatedBase } from "../utils/PaginatedBase";

export const bankAccountRepository: InjectionToken = "IBankAccountRepository";

export interface IBankAccountRepository {
	getAllBankAccountsForUser(user: EntityKey, limit: number, offset: number): Promise<PaginatedBase<BankAccount>>;

	get(id: EntityKey): Promise<BankAccount>;

	delete(id: EntityKey): Promise<void>;
}