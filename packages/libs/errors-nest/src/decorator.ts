import { IHttpCodeError, UnexpectedError } from "@finance/errors";
import { ApiResponse } from "@nestjs/swagger";
import type { AnyConstructor } from "@finance/libs-types";

type HttpErrorConstructor = AnyConstructor<IHttpCodeError & Error>;

export function FinanceErrors<T extends HttpErrorConstructor>(errors: T[]) {
	const allErrors: (T | AnyConstructor<UnexpectedError>)[] = errors;

	if (allErrors.find(x => x.name == UnexpectedError.name) === undefined) {
		allErrors.push(UnexpectedError);
	}
	
	const decorators = errors.map(x => {
		return ApiResponse({
			status: (new x()).httpCode(),
			description: x.name,
		})
	})

	return function (target: object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
		decorators.forEach(x => x(target, propertyKey, descriptor))
	}
}