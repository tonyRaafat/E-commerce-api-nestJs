/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggerInerceptor implements NestInterceptor {
  constructor() {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const logger = new Logger(LoggerInerceptor.name);

    const request = context.switchToHttp().getRequest();

    const { method, path: url } = request;
    const className = context.getClass().name;
    const handlerName = context.getHandler().name;

    logger.verbose(
      `${method} ${url} | Context: ${className} Handler: ${handlerName} invoked... `,
    );
    logger.debug('Request Body:', request.body);
    logger.debug('Request Header:', request.headers);

    const now = Date.now();

    return next.handle().pipe(
      tap((res) => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        const contentLength = response.get('content-length');
        Logger.log(
          `${method} ${url} ${statusCode} | Content Length: ${contentLength} | Execution Time:: ${Date.now() - now}ms`,
        );

        logger.debug('Response:', res);
      }),
    );
  }
}
