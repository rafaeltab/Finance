import { ApiProperty } from "@nestjs/swagger";

export class PaginatedResponsePage { 
	@ApiProperty({
		type: "number",
		description: "The amount available in this response",
		example: 10
	})
	count!: number;

	@ApiProperty({
		type: "number",
		description: "The starting index of the paginated data",
		example: 0
	})
	offset!: number;

	@ApiProperty({
		type: "number",
		description: "The total number of items available",
		example: 10
	})
	total!: number;
}

export class PaginatedResponse {
	@ApiProperty({
		type: PaginatedResponsePage
	})
	page!: PaginatedResponsePage
}

export interface PaginatedResponseData<TData> { 
	data: TData[]
}