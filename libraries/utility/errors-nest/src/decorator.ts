import { IHttpCodeError, UnexpectedError } from "@finance/lib-errors";
import { ApiProperty, ApiResponse } from "@nestjs/swagger";
import type { AnyConstructor } from "@finance/lib-basic-types";

type HttpErrorConstructor = AnyConstructor<IHttpCodeError & Error>;

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

export function FinanceErrors<T extends HttpErrorConstructor>(errors: T[]) {
    const allErrors: (T | AnyConstructor<UnexpectedError>)[] = errors;

    if (allErrors.find(x => x.name === UnexpectedError.name) === undefined) {
        allErrors.push(UnexpectedError);
    }
	
    const decorators = errors.map(X => ApiResponse({
        status: (new X()).getHttpCode(),
        description: X.name,
        type: HttpErrorResponse
    }))

    return (target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
        decorators.forEach(x => x(target, propertyKey, descriptor))
    }
}

