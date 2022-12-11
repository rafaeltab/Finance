import { Module } from "@finance/modules";
import { DependencyContainer } from "tsyringe";
import { StockAssetValuesLoadedDomainEventHandler, StockAssetValuesLoadedDomainEventHandlerToken } from "./events/stockAsset/StockAssetValuesLoadedDomainEventHandler";

export class DomainEventsModuleModule implements Module {

	async init(): Promise<void> {
		return;
	}

	register(container: DependencyContainer) {
		container.register(StockAssetValuesLoadedDomainEventHandlerToken, StockAssetValuesLoadedDomainEventHandler);
		return;
	}
}