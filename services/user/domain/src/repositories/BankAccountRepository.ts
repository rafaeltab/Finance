import type { InjectionToken } from "tsyringe";
import type BankAccount from "../aggregates/bankAccountAggregate";
import type { EntityKey } from "../utils";
import type { PaginatedBase } from "../utils/PaginatedBase";

export const bankAccountRepository: InjectionToken = "IBankAccountRepository";

export interface IBankAccountRepository {
	getAllBankAccountsForUser(user: EntityKey, limit: number, offset: number): Promise<PaginatedBase<BankAccount>>;

	get(id: EntityKey): Promise<BankAccount>;

	delete(id: EntityKey): Promise<void>;
}