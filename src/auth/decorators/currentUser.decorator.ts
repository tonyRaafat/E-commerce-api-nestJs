import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

const getCurrentUser = (context: ExecutionContext): any =>
  context.switchToHttp().getRequest<Request>().user;
export const currentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): any => getCurrentUser(context),
);
