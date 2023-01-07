import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe({
		transform: true,
		forbidUnknownValues: true,
	}));

	const config = new DocumentBuilder()
		.setTitle("Finance API")
		.setDescription("Finance API description")
		.setVersion("1.0")
		.addTag("finance")
		.build();
	
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("api/docs", app, document);

	await app.listen(3000);
}
bootstrap();
