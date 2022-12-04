import { Module } from "@finance/modules";
import { DependencyContainer } from "tsyringe";

export class DomainModule implements Module {
	async init(): Promise<void> {
		return;
	}

	register(container: DependencyContainer) {
		return;
	}
}