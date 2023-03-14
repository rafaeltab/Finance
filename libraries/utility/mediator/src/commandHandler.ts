import type { ICommand, ICommandResult } from "./command";

export abstract class ICommandHandler<TCommand extends ICommand<TCommand, TResult>, TResult extends ICommandResult<any>> {
	static createToken<TCommand extends ICommand<TCommand, TResult>, TResult extends ICommandResult<any>>(Command: new () => TCommand) {
		return `ICommandHandler<${new Command().token}>`
	}

	abstract handle(command: TCommand): Promise<TResult>
}