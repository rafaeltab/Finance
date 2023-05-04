
import { container, DependencyContainer } from "tsyringe";
import type { ICommand, ICommandResult } from "./command";
import { ICommandHandler } from "./commandHandler";
import type { IEvent } from "./event";
import { IEventHandler } from "./eventHandler";
import type { MediatorModule } from "./module";
import type { IQuery, IQueryResult } from "./query";
import { IQueryHandler } from "./queryHandler";

export interface ITokenable { 
	token: string;
}

export type CommandResponeType<T extends ICommand<unknown, ICommandResult<unknown>>> = T extends ICommand<T, infer TResponse> ? TResponse : null;
export type QueryResponeType<T extends IQuery<unknown, ICommandResult<unknown>>> = T extends IQuery<T, infer TResponse> ? TResponse : null;

export class Mediator {
    private container: DependencyContainer;

    constructor() {
        this.container = container.createChildContainer();
    }

    get depContainer() {
        return container;
    }

    private mediatorModules: MediatorModule[] = [];

    async register<TModule extends new (dependencyContainer: DependencyContainer) => MediatorModule>(Module: TModule) {
        const moduleInstance = new Module(this.container);
        await moduleInstance.register();
        this.mediatorModules.push(moduleInstance);
    }

    /** Run a query and wait for the result */
    query<TQuery extends IQuery<TQuery, TResult>, TResult extends IQueryResult<unknown>>(query: TQuery): Promise<QueryResponeType<TQuery>>{
        const handler: IQueryHandler<TQuery, TResult> = this.container.resolve(IQueryHandler.createToken(Object.getPrototypeOf(query).constructor));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return handler.handle(query) as any;
    }

    /** Send an event and let it run behind the scenes */
    send<TEvent extends IEvent<TEvent>>(event: TEvent): void{
        const handler: IEventHandler<TEvent> = this.container.resolve(IEventHandler.createToken(Object.getPrototypeOf(event).constructor));
        handler.handle(event);
    }

    /** Run a command, and wait for it to complete */
    command<TCommand extends ICommand<TCommand, TResult>, TResult extends ICommandResult<unknown>>(command: TCommand): Promise<CommandResponeType<TCommand>>{
        const handler: ICommandHandler<TCommand, TResult> = this.container.resolve(ICommandHandler.createToken(Object.getPrototypeOf(command).constructor));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return handler.handle(command) as any;
    }

    async dispose() { 
        await Promise.all(this.mediatorModules.map(async (x) => {
            await x.dispose();
        }));
    }
}
