import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { createSwaggerDocument, setupSwagger } from "./swagger";
import { writeFileSync } from "fs";

async function bootstrap() {
	const app = await createApp();

	setupSwagger(app);

	await app.listen(3000);
}

async function createApp() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe({
		transform: true,
		forbidUnknownValues: true,
	}));
	return app;
}

async function generateDefinition() {
	const app = await createApp();
	const document = createSwaggerDocument(app);

	writeFileSync("swagger.json", JSON.stringify(document, null, 4));
}

if (process.argv.includes("--generate-swagger")) {
	generateDefinition();
} else { 
	bootstrap();
}

