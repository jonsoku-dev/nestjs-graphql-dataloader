import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RegisterInput } from './dtos/register.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { AuthService } from './auth.service';
import { User } from './entities/user.entitiy';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { GenerateCodeAndSendMailInput } from './dtos/generate-code-and-send-mail.dto';
import { ConfirmCodeArg } from './dtos/confirm-code.dto';
import { UserOutput } from './dtos/shared.dto';
import { ResetPasswordInput } from './dtos/reset-password.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query((returns) => Boolean)
  test() {
    return true;
  }

  @Mutation((returns) => UserOutput)
  register(@Args('input') registerInput: RegisterInput): Promise<UserOutput> {
    return this.authService.register(registerInput);
  }

  @Mutation((returns) => LoginOutput)
  login(@Args('input') loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => UserOutput)
  me(@CurrentUser() user: User) {
    return {
      ok: true,
      data: user,
    };
  }

  @Mutation((returns) => String)
  generateCodeAndSendMail(
    @Args('input') generateCodeAndSendMailInput: GenerateCodeAndSendMailInput,
  ) {
    return this.authService.generateCodeAndSendMail(
      generateCodeAndSendMailInput,
    );
  }

  @Mutation((returns) => String)
  confirmCode(@Args() confirmCodeArg: ConfirmCodeArg) {
    return this.authService.confirmCode(confirmCodeArg);
  }

  @Mutation((returns) => UserOutput)
  resetPassword(@Args('input') resetPasswordInput: ResetPasswordInput) {
    return this.authService.resetPassword(resetPasswordInput);
  }
}
