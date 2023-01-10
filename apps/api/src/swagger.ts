import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function setupSwagger(app: INestApplication) { 
	const document = createSwaggerDocument(app);
	SwaggerModule.setup("api/docs", app, document);
}

export function createSwaggerDocument(app: INestApplication) { 
	const config = new DocumentBuilder()
		.setTitle("Finance API")
		.setDescription("Finance API description")
		.setVersion("1.0")
		.addTag("finance")
		.build();

	return SwaggerModule.createDocument(app, config);
}
