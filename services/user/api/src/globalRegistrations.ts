import { FinanceProgrammerErrorExceptionFilter, FinanceUserErrorExceptionFilter } from "@finance/lib-errors-nest";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { AuthzGuard } from "./authz/authz.guard";

export function validationPipe(app: INestApplication) { 
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        forbidUnknownValues: false,
    }));
}

export function authzGuard(app: INestApplication) { 
    app.useGlobalGuards(new AuthzGuard());
}

export function errorsFilter(app: INestApplication) { 
    app.useGlobalFilters(
        new FinanceUserErrorExceptionFilter(app.getHttpAdapter()),
        new FinanceProgrammerErrorExceptionFilter(app.getHttpAdapter()));
}

export function cors(app: INestApplication) {
    app.enableCors({
        origin: /http:\/\/localhost:(3000|3001)/
    });
}
