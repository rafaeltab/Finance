import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const Subject = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user.sub;
})