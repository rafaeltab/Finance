import type { InjectionToken } from "tsyringe";
import type BankAccount from "../aggregates/bankAccountAggregate";
import type { EntityKey } from "../utils";

export const bankAccountFactory: InjectionToken = "IBankAccountFactory";

export interface IBankAccountFactory {
	addBankAccountToUser(user: EntityKey, bank: string, balance: number, currency: string): Promise<BankAccount>;
}