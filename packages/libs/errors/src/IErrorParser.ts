export interface IErrorParser<TImplementation extends Error> { 
	isError(error: Error): error is TImplementation;
}