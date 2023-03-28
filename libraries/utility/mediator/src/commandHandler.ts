import type { ICommand, ICommandResult } from "./command";

export abstract class ICommandHandler<TCommand extends ICommand<TCommand, TResult>, TResult extends ICommandResult<unknown>> {
	static createToken<TCommand extends ICommand<TCommand, TResult>, TResult extends ICommandResult<unknown>>(Command: new () => TCommand) {
		return `ICommandHandler<${new Command().token}>`
	}

	abstract handle(command: TCommand): Promise<TResult>
}