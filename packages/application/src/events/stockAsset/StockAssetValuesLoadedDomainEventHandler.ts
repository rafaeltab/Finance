import { createHandlerToken, IEventHandler } from "../../mediator";
import { StockAssetValuesLoadedDomainEvent } from "./StockAssetValuesLoadedDomainEvent";

export const StockAssetValuesLoadedDomainEventHandlerToken = createHandlerToken(StockAssetValuesLoadedDomainEvent);
export class StockAssetValuesLoadedDomainEventHandler implements IEventHandler<StockAssetValuesLoadedDomainEvent> {

	constructor() {
	}

	async handle(event: StockAssetValuesLoadedDomainEvent): Promise<void> {

	}
}