import { Module } from "@finance/modules";
import { DependencyContainer } from "tsyringe";

export class DomainEventsModule implements Module {

	async init(): Promise<void> {
		return;
	}

	register(container: DependencyContainer) {
		// container.register(StockAssetValuesLoadedDomainEventHandlerToken, StockAssetValuesLoadedDomainEventHandler);
		return;
	}
}