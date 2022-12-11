import { Module } from "@finance/modules";
import { DependencyContainer } from "tsyringe";
import { DomainEventsModuleModule } from "./domainEventsModule";
import { Mediator } from "./mediator";

export class ApplicationModule implements Module {
	private mediator: Mediator;

	async init(): Promise<void> {
		this.mediator = new Mediator();
		await this.mediator.register(DomainEventsModuleModule);
		return;
	}

	register(container: DependencyContainer) {
		container.register(Mediator, {
			useValue: this.mediator
		})
	}
}