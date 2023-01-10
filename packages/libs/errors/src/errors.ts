import type { AnyConstructor } from "@finance/libs-types";
import type { IErrorParser } from "./IErrorParser";
import { DuplicateEntryError, DuplicateEntryParser } from "./database/DuplicateEntryError"
import { EntryNotFoundError, EntryNotFoundParser } from "./database/EntryNotFoundError";

export const errors: ([AnyConstructor<Error>, AnyConstructor<IErrorParser<Error>>][]) = [
	[DuplicateEntryError, DuplicateEntryParser],
	[EntryNotFoundError, EntryNotFoundParser]
];