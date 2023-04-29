import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from "crypto";
import { yellow, clc } from "@nestjs/common/utils/cli-colors.util";

function getDuration (start: [number, number])  {
    const NS_PER_SEC = 1e9
    const NS_TO_MS = 1e6
    const diff = process.hrtime(start)

    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
}

const httpColorMap: Record<number, (txt: string) => string> = {
    100: clc.green,// Continue
    101: clc.green,// Switching Protocols
    103: clc.green,// Early Hints
    200: clc.green,// OK
    201: clc.green,// Created
    202: clc.green,// Accepted
    203: clc.green,// Non - Authoritative Information
    204: clc.green,// No Content
    205: clc.green,// Reset Content
    206: clc.green,// Partial Content
    300: clc.green,// Multiple Choices
    301: clc.green,// Moved Permanently
    302: clc.green,// Found
    303: clc.green,// See Other
    304: clc.green,// Not Modified
    307: clc.green,// Temporary Redirect
    308: clc.green,// Permanent Redirect
    400: clc.magentaBright,// Bad Request
    401: clc.magentaBright,// Unauthorized
    402: clc.magentaBright,// Payment Required
    403: clc.magentaBright,// Forbidden
    404: clc.magentaBright,// Not Found
    405: clc.magentaBright,// Method Not Allowed
    406: clc.magentaBright,// Not Acceptable
    407: clc.magentaBright,// Proxy Authentication Required
    408: clc.magentaBright,// Request Timeout
    409: clc.magentaBright,// Conflict
    410: clc.magentaBright,// Gone
    411: clc.magentaBright,// Length Required
    412: clc.magentaBright,// Precondition Failed
    413: clc.magentaBright,// Payload Too Large
    414: clc.magentaBright,// URI Too Long
    415: clc.magentaBright,// Unsupported Media Type
    416: clc.magentaBright,// Range Not Satisfiable
    417: clc.magentaBright,// Expectation Failed
    418: clc.magentaBright,// I'm a teapot
    422: clc.magentaBright,// Unprocessable Entity
    425: clc.magentaBright,// Too Early
    426: clc.magentaBright,// Upgrade Required
    428: clc.magentaBright,// Precondition Required
    429: clc.magentaBright,// Too Many Requests
    431: clc.magentaBright,// Request Header Fields Too Large
    451: clc.magentaBright,// Unavailable For Legal Reasons
    500: clc.red,// Internal Server Error
    501: clc.red,// Not Implemented
    502: clc.red,// Bad Gateway
    503: clc.red,// Service Unavailable
    504: clc.red,// Gateway Timeout
    505: clc.red,// HTTP Version Not Supported
    506: clc.red,// Variant Also Negotiates
    507: clc.red,// Insufficient Storage
    508: clc.red,// Loop Detected
    510: clc.red,// Not Extended
    511: clc.red,// Network Authentication Required
}

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
    private logger = new Logger('HTTP');

    use(request: Request, response: Response, next: NextFunction): void {
        const requestId = clc.cyanBright(randomUUID());
        const { ip, method, baseUrl: url } = request;

        const userAgent = request.get('user-agent') ?? '';
        const start = process.hrtime();

        const requestMessage = `${requestId} ${method} ${url} {User-Agent: "${userAgent}", Ip: "${ip}"}}`
        this.logger.log(requestMessage);

        response.on('close', () => {
            const time = getDuration(start);

            const executionString = yellow(`+${time.toFixed(0)}ms`);
            const { statusCode } = response;

            const coloredStatusCode = (httpColorMap[statusCode] ?? (clc.red))(statusCode.toString());

            const contentLength = parseInt(response.get('content-length') ?? "0", 10);

            const responseMessage = `${requestId} ${method} ${coloredStatusCode} ${url} {Content-Length: ${contentLength}} ${executionString}`

            this.logger.log(responseMessage);
        });

        next();
    }
}

