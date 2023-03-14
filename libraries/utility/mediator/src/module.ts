import type { AnyConstructor } from "@finance/lib-basic-types";
import type { Module } from "@finance/lib-module-types";
import type { DependencyContainer } from "tsyringe";
import type { ICommand, ICommandResult } from "./command";
import { ICommandHandler } from "./commandHandler";
import type { IEvent } from "./event";
import { IEventHandler } from "./eventHandler";
import type { IQuery, IQueryResult } from "./query";
import { IQueryHandler } from "./queryHandler";

export abstract class MediatorModule {
	constructor(private container: DependencyContainer) {
	}

	private modules: Module[] = [];

	abstract register(): Promise<void>;

	protected registerQuery<TQuery extends IQuery<TQuery, TResult>, TResult extends IQueryResult<any>>(query: AnyConstructor<TQuery>, handler: AnyConstructor<IQueryHandler<TQuery, TResult>>) {
		const handlerToken = IQueryHandler.createToken(query);

		this.container.register(handlerToken, handler);
	}

	protected registerEvent<TEvent extends IEvent<TEvent>>(event: AnyConstructor<TEvent>, handler: AnyConstructor<IEventHandler<TEvent>>) {
		const handlerToken = IEventHandler.createToken(event);

		this.container.register(handlerToken, handler);
	}

	protected registerCommand<TCommand extends ICommand<TCommand, TResult>, TResult extends ICommandResult<any>>(comand: AnyConstructor<TCommand>, handler: AnyConstructor<ICommandHandler<TCommand, TResult>>) {
		const handlerToken = ICommandHandler.createToken(comand);

		this.container.register(handlerToken, handler);
	}

	protected async registerModule<TModule extends Module>(Module: new () => TModule) {
		const moduleInstance = new Module();
		await moduleInstance.init();
		await moduleInstance.register(this.container);
		this.modules.push(moduleInstance);
	}

	abstract dispose(): Promise<void>;

	protected disposeModules() {
		return Promise.all(this.modules.map(async x => {
			await x.dispose();
		}));
	}
}