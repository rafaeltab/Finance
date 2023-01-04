import "reflect-metadata"
import { ICommand, ICommandHandler, ICommandResult, IEvent, IEventHandler, IQuery, IQueryHandler, IQueryResult, Mediator, MediatorModule } from "#src/mediator";

let mediator: Mediator;

//#region setup

class TestModule extends MediatorModule {
	async register(): Promise<void> {
		this.registerQuery(TestQuery, TestQueryHandler);

		this.registerEvent(TestEvent, TestEventHandler);

		this.registerCommand(TestCommand, TestCommandHandler);
	}

	async dispose() {
		
	}
}

class TestQuery extends IQuery<TestQuery, IQueryResult<string>> {
	token: string = "TestQuery"; 

	data!: string;
}

class TestQueryHandler extends IQueryHandler<TestQuery, IQueryResult<string>> {
	async handle(query: TestQuery): Promise<IQueryResult<string>> {
		return {
			success: true,
			data: query.data
		};
	}
}

class TestEvent extends IEvent<TestEvent> {
	token: string = "TestEvent";

	data!: () => void;
}

class TestEventHandler extends IEventHandler<TestEvent> {
	async handle(event: TestEvent): Promise<void> {
		event.data();
	}
}

class TestCommand extends ICommand<TestCommand> {
	token: string = "TestCommand";

	data!: () => void;
}

class TestCommandHandler extends ICommandHandler<TestCommand> {
	async handle(event: TestCommand): Promise<ICommandResult> {
		event.data();
		return {
			success: true
		}
	}
}

//#endregion setup

beforeAll(async () => {
	mediator = new Mediator();
	await mediator.register(TestModule);
})

test("query", async () => {
	const query = new TestQuery({
		data: "TestQueryData"
	})
	
	const result = await mediator.query(query);

	expect(result.success).toBe(true);
	if (result.success) {
		expect(result.data).toBe("TestQueryData");
	}
});

test("event", () => {
	

	return new Promise((resolve) => {
		const event = new TestEvent({
			data: () => {
				expect(true).toBe(true);
				resolve(true);
			}
		})
		
		mediator.send(event);
	});	
});

test("command", async () => {
	let counter = 0;
	let command = new TestCommand({
		data: () => {
			counter++;
		}
	});

	const res = await mediator.command(command);
	expect(res.success).toBe(true);
	expect(counter).toBe(1);
});