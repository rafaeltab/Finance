// list a maximum of 30 asset groups

import { IStockFactory, InsertStockValue, stockFactory } from "@finance/svc-user-domain";
import { ICommand, ICommandHandler, ICommandResult } from "@finance/lib-mediator";
import { IUnitOfWork, unitOfWork } from "@finance/svc-user-infra-postgres";
import { inject, injectable } from "tsyringe";

export type ResponseType = ICommandResult<number>;

export class AddValuesToStockDataCommand extends ICommand<AddValuesToStockDataCommand, ResponseType> {
	token = "AddValuesToStockDataCommand";
	stockDataIdentity!: string;
	values!: InsertStockValue[];
}

@injectable()
export class AddValuesToStockDataCommandHandler extends ICommandHandler<AddValuesToStockDataCommand, ResponseType> {
	constructor(
		@inject(stockFactory) private stockFactory: IStockFactory,
		@inject(unitOfWork) private unitOfWork: IUnitOfWork
	) {
		super();
	}

	async handle(command: AddValuesToStockDataCommand): Promise<ResponseType> {
		try {
			await this.unitOfWork.start();

			const result = await this.stockFactory.addStockValues({
				identity: command.stockDataIdentity,
			}, command.values);

			await this.unitOfWork.commit();

			return {
				success: true,
				data: result.length
			}
		} catch (error) {
			await this.unitOfWork.rollback();
			throw error;
		}
	}
}