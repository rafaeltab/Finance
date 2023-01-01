import { Controller, Get, NotImplementedException } from '@nestjs/common';

@Controller("/api/v1/user")
export class UserController {
	constructor() { }

	@Get()
	get(): string {
		// return this.mediator.query(new )
		throw new NotImplementedException();
	}
}
