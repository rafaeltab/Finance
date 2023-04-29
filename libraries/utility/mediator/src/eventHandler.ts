import type { IEvent } from "./event";

export abstract class IEventHandler<TEvent extends IEvent<TEvent>> {
    static createToken<TEvent extends IEvent<TEvent>>(Event: new () => TEvent) {
        return `IEventHandler<${new Event().token}>`
    }

	abstract handle(command: TEvent): Promise<void>
}