import { Module } from "@finance/modules";
import { container, DependencyContainer, } from "tsyringe";

export interface IEvent {

}

export interface IEventHandler<T extends IEvent> {
	handle(event: T): Promise<void>;
}

export class Mediator {
	private container: DependencyContainer;
	constructor() {
		this.container = container.createChildContainer();
	}

	async register<TModule extends new () => Module>(module: TModule) {
		var moduleInstance = new module();
		await moduleInstance.init();
		await moduleInstance.register(this.container);
	}

	send<TEvent extends IEvent>(event: TEvent) {
		const handler = this.container.resolve<IEventHandler<TEvent>>(createHandlerToken(Object.getPrototypeOf(event)));
		void handler.handle(event).catch((err) => { 
			throw err;
		});
	}
}

export function createHandlerToken<TEvent extends new () => IEvent>(event: TEvent) {
	return Symbol(`IEventHandler<${event.name}>`);
}