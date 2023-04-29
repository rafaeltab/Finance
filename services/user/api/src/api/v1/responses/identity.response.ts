import { ApiProperty } from "@nestjs/swagger";

export class EntityResponse { 
	@ApiProperty({
	    type: "string"
	})
	    identity!: string;
}