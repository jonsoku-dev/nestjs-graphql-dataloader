import {
  Args,
  Context,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root,
  Parent,
} from '@nestjs/graphql';
import { RegisterInput } from './dtos/register.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { AuthService } from './auth.service';
import { User } from './entities/user.entitiy';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { ForgotPasswordInput } from './dtos/forgot-password.dto';
import { ResetPasswordInput } from './dtos/reset-password.dto';
import { ForgotEmailInput } from './dtos/forgot-email.dto';
import { IGraphQLContext } from '../types/graphql.types';

@Resolver((of) => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query((returns) => Boolean)
  test() {
    return true;
  }

  @Mutation((returns) => User)
  register(@Args('input') registerInput: RegisterInput): Promise<User> {
    return this.authService.register(registerInput);
  }

  @Mutation((returns) => LoginOutput)
  login(@Args('input') loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  me(@CurrentUser() user: User) {
    return user;
  }

  @Query(() => User)
  findUser(@Args('userId') userId: string) {
    return this.authService.findOneById(userId);
  }

  @Mutation((returns) => User)
  forgotEmail(@Args('input') forgotEmailInput: ForgotEmailInput) {
    return this.authService.forgotEmail(forgotEmailInput);
  }

  @Mutation((returns) => String)
  forgotPassword(@Args('input') forgotPasswordInput: ForgotPasswordInput) {
    return this.authService.forgotPassword(forgotPasswordInput);
  }

  @Mutation(() => User)
  resetPassword(@Args('input') resetPasswordInput: ResetPasswordInput) {
    return this.authService.resetPassword(resetPasswordInput);
  }

  @ResolveField()
  sns(@Parent() user: User, @Context() ctx: IGraphQLContext) {
    return ctx.snsLoader.load(user.id);
  }
}
