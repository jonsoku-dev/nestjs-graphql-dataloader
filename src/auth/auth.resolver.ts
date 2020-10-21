import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
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

@Resolver()
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
}
