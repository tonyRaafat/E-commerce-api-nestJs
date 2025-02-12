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
    // const userAgent = request.get('user-agent') || 'user-agent: unknown';
    const { method, path, ip } = request;
    const className = context.getClass().name;
    const handlerName = context.getHandler().name;

    logger.verbose(
      `${method} ${path} | Ip: ${ip} Context: ${className} Handler: ${handlerName} invoked... `,
    );

    const now = Date.now();

    return next.handle().pipe(
      tap((res) => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        const contentLength = response.get('content-length');
        Logger.log(
          `${method} ${path} ${statusCode} | Content Length: ${contentLength} - ip: ${ip} Time: ${Date.now() - now}ms`,
        );

        logger.debug('Response:', res);
      }),
    );
  }
}
