export class PaginatedBase<TData> {
	page!: {
		/** The amount available in this response */
		count: number;
		/** The starting index of the paginated data */
		offset: number;
		/** The total number of items available */
		total: number;
	}

	data!: TData[]
}

