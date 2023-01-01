import { container, DependencyContainer, } from "tsyringe";
import { IQuery, IQueryHandler, IQueryResult } from "./query";
import { IEvent, IEventHandler } from "./event";
import { ICommand, ICommandHandler, ICommandResult } from "./command";
import type { AnyConstructor } from "../constructor";
import type { Module } from "@finance/modules";

export interface ITokenable { 
	token: string;
}

export class Mediator {
	private container: DependencyContainer;
	constructor() {
		this.container = container.createChildContainer();
	}

	async register<TModule extends new (container: DependencyContainer) => MediatorModule>(module: TModule) {
		var moduleInstance = new module(this.container);
		await moduleInstance.register();
	}

	/** Run a query and wait for the result */
	query<TQuery extends IQuery<TQuery, TResult>, TResult extends IQueryResult<any>>(query: TQuery): Promise<IQueryResult<TResult>>{
		var handler: IQueryHandler<TQuery, TResult> = this.container.resolve(IQueryHandler.createToken(Object.getPrototypeOf(query).constructor));
		return handler.handle(query);
	}

	/** Send an event and let it run behind the scenes */
	send<TEvent extends IEvent<TEvent>>(event: TEvent): void{
		var handler: IEventHandler<TEvent> = this.container.resolve(IEventHandler.createToken(Object.getPrototypeOf(event).constructor));
		void handler.handle(event);
	}

	/** Run a command, and wait for it to complete */
	command<TCommand extends ICommand<TCommand>>(command: TCommand): Promise<ICommandResult>{
		var handler: ICommandHandler<TCommand> = this.container.resolve(ICommandHandler.createToken(Object.getPrototypeOf(command).constructor));
		return handler.handle(command);
	}
}

export abstract class MediatorModule {  
	constructor(private container: DependencyContainer) { 
	}

	abstract register(): Promise<void>;

	protected registerQuery<TQuery extends IQuery<TQuery, TResult>, TResult extends IQueryResult<any>>(query: AnyConstructor<TQuery>, handler: AnyConstructor<IQueryHandler<TQuery, TResult>>) {
		var handlerToken = IQueryHandler.createToken(query);

		this.container.register(handlerToken, handler);
	}

	protected registerEvent<TEvent extends IEvent<TEvent>>(event: AnyConstructor<TEvent>, handler: AnyConstructor<IEventHandler<TEvent>>) {
		var handlerToken = IEventHandler.createToken(event);

		this.container.register(handlerToken, handler);
	}

	protected registerCommand<TCommand extends ICommand<TCommand>>(comand: AnyConstructor<TCommand>, handler: AnyConstructor<ICommandHandler<TCommand>>) {
		var handlerToken = ICommandHandler.createToken(comand);

		this.container.register(handlerToken, handler);
	}

	protected async registerModule<TModule extends Module>(module: new () => TModule) {
		var moduleInstance = new module();
		await moduleInstance.init();
		await moduleInstance.register(this.container);
	}
}