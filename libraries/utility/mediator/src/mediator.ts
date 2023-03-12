import { container, DependencyContainer, } from "tsyringe";
import { IQuery, IQueryHandler, IQueryResult } from "./query";
import { IEvent, IEventHandler } from "./event";
import { ICommand, ICommandHandler, ICommandResult } from "./command";
import type { AnyConstructor } from "@finance/lib-basic-types";
import type { Module } from "@finance/lib-module-types";

export interface ITokenable { 
	token: string;
}

export type CommandResponeType<T extends ICommand<any, any>> = T extends ICommand<T, infer TResponse> ? TResponse : null;
export type QueryResponeType<T extends IQuery<any, any>> = T extends IQuery<T, infer TResponse> ? TResponse : null;

export class Mediator {
	private container: DependencyContainer;
	constructor() {
		this.container = container.createChildContainer();
	}

	private _mediatorModules: MediatorModule[] = [];

	async register<TModule extends new (container: DependencyContainer) => MediatorModule>(module: TModule) {
		var moduleInstance = new module(this.container);
		await moduleInstance.register();
		this._mediatorModules.push(moduleInstance);
	}

	/** Run a query and wait for the result */
	query<TQuery extends IQuery<TQuery, TResult>, TResult extends IQueryResult<any>>(query: TQuery): Promise<QueryResponeType<TQuery>>{
		var handler: IQueryHandler<TQuery, TResult> = this.container.resolve(IQueryHandler.createToken(Object.getPrototypeOf(query).constructor));
		return handler.handle(query) as any;
	}

	/** Send an event and let it run behind the scenes */
	send<TEvent extends IEvent<TEvent>>(event: TEvent): void{
		var handler: IEventHandler<TEvent> = this.container.resolve(IEventHandler.createToken(Object.getPrototypeOf(event).constructor));
		void handler.handle(event);
	}

	/** Run a command, and wait for it to complete */
	command<TCommand extends ICommand<TCommand, TResult>, TResult extends ICommandResult<any>>(command: TCommand): Promise<CommandResponeType<TCommand>>{
		var handler: ICommandHandler<TCommand, TResult> = this.container.resolve(ICommandHandler.createToken(Object.getPrototypeOf(command).constructor));
		return handler.handle(command) as any;
	}

	async dispose() { 
		await Promise.all(this._mediatorModules.map(async (x) => {
			await x.dispose();
		}));
	}
}

export abstract class MediatorModule {  
	constructor(private container: DependencyContainer) { 
	}

	private _modules: Module[] = [];

	abstract register(): Promise<void>;

	protected registerQuery<TQuery extends IQuery<TQuery, TResult>, TResult extends IQueryResult<any>>(query: AnyConstructor<TQuery>, handler: AnyConstructor<IQueryHandler<TQuery, TResult>>) {
		var handlerToken = IQueryHandler.createToken(query);

		this.container.register(handlerToken, handler);
	}

	protected registerEvent<TEvent extends IEvent<TEvent>>(event: AnyConstructor<TEvent>, handler: AnyConstructor<IEventHandler<TEvent>>) {
		var handlerToken = IEventHandler.createToken(event);

		this.container.register(handlerToken, handler);
	}

	protected registerCommand<TCommand extends ICommand<TCommand, TResult>, TResult extends ICommandResult<any>>(comand: AnyConstructor<TCommand>, handler: AnyConstructor<ICommandHandler<TCommand, TResult>>) {
		var handlerToken = ICommandHandler.createToken(comand);

		this.container.register(handlerToken, handler);
	}

	protected async registerModule<TModule extends Module>(module: new () => TModule) {
		var moduleInstance = new module();
		await moduleInstance.init();
		await moduleInstance.register(this.container);
		this._modules.push(moduleInstance);
	}

	abstract dispose(): Promise<void>;

	protected disposeModules() {
		return Promise.all(this._modules.map(async x => {
			await x.dispose();
		}));
	}
}