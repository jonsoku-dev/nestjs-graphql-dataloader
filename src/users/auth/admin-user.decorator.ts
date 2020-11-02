import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserRole } from './entities/user.entitiy';

export const AdminUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    if (ctx.getContext().req.user.role !== UserRole.Admin) {
      throw new UnauthorizedException('관리자계정으로 로그인하세요.');
    }
    return ctx.getContext().req.user;
  },
);
