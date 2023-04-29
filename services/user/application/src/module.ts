import type { Module } from "@finance/lib-module-types";
import type { DependencyContainer } from "tsyringe";
import { Mediator } from "@finance/lib-mediator";
import { ApplicationMediatorModule } from "./applicationMediatorModule";

export class ApplicationModule implements Module {
    private mediator?: Mediator;

    async init(): Promise<void> {
        this.mediator = new Mediator();
		
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

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async dispose() {}
}