import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, Min, MinLength, ValidateNested } from "class-validator";

export class StockOrderBody {
	@ApiProperty({
	    type: Number,
	    minimum: 0
	})
	@IsNumber({
	    maxDecimalPlaces: 2
	})
	@Min(0)
	    price!: number;

	@ApiProperty({
	    type: Number,
	    minimum: 0
	})
	@IsNumber({
	    maxDecimalPlaces: 2
	})
	@Min(0)
	    amount!: number;
}

export class CreateStockAssetBody {
	@ApiProperty({
	    type: String,
	    minLength: 5
	})
	@IsString()
	@MinLength(5)
	    stockDataIdentity!: string;

	@ApiProperty({
	    type: [StockOrderBody],
	    minLength: 5
	})
	@ValidateNested({
	    each: true
	})
	    stockOrders!: StockOrderBody[];
}
