import { ApiProperty } from "@nestjs/swagger";

export class SuccessResponse {
	@ApiProperty({
		type: "boolean"
	})
	success!: true;
}

export interface SuccessResponseData<TData> { 
	data: TData 
}