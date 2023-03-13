import { IHttpCodeError, UnexpectedError } from "@finance/lib-errors";
import { ApiProperty, ApiResponse } from "@nestjs/swagger";
import type { AnyConstructor } from "@finance/lib-basic-types";

type HttpErrorConstructor = AnyConstructor<IHttpCodeError & Error>;

export function FinanceErrors<T extends HttpErrorConstructor>(errors: T[]) {
	const allErrors: (T | AnyConstructor<UnexpectedError>)[] = errors;

	if (allErrors.find(x => x.name == UnexpectedError.name) === undefined) {
		allErrors.push(UnexpectedError);
	}
	
	const decorators = errors.map(x => ApiResponse({
			status: (new x()).httpCode(),
			description: x.name,
			type: HttpErrorResponse
		}))

	return function (target: object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
		decorators.forEach(x => x(target, propertyKey, descriptor))
	}
}

class HttpErrorResponse { 
	@ApiProperty({
		type: "integer",
		description: "The http code returned by the server"
	})
	statusCode!: number;

	@ApiProperty({
		type: "string",
		description: "A message describing the error that occurred"
	})
	message!: string;
}