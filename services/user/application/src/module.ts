import type { Module } from "@finance/lib-module-types";
import type { DependencyContainer } from "tsyringe";
import { ApplicationMediatorModule } from "./applicationMediatorModule";
import { Mediator } from "@finance/lib-mediator";

export class ApplicationModule implements Module {
	private mediator?: Mediator;

	async init(): Promise<void> {
		this.mediator = new Mediator();
		return;
	}

	register(container: DependencyContainer) {
		if (!this.mediator) {
			throw new Error("Module is not initialized");
		}
		this.mediator.register(ApplicationMediatorModule);
		
		container.register(Mediator, {
			useValue: this.mediator
		});
	}

	async dispose() { 

	}
}