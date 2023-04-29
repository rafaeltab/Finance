import type { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { writeFileSync } from "fs";
import { AppModule } from "./app.module";
import { authzGuard, cors, errorsFilter, validationPipe } from "./globalRegistrations";
import { createSwaggerDocument, setupSwagger } from "./swagger";

function registerComponents(app: INestApplication) {
    validationPipe(app);
    authzGuard(app);
    errorsFilter(app);
    cors(app);
}

async function createApp() {
    const app = await NestFactory.create(AppModule, {
        logger: console
    });
    registerComponents(app);
    return app;
}

async function bootstrap() {
    const app = await createApp();

    setupSwagger(app);

    await app.listen(3000);
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
