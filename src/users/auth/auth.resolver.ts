import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GoogleRegisterInput, RegisterInput } from './dtos/register.dto';
import { GoogleLoginInput, LoginInput, LoginOutput } from './dtos/login.dto';
import { AuthService } from './auth.service';
import { User } from './entities/user.entitiy';
import { Res, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { ForgotPasswordInput } from './dtos/forgot-password.dto';
import { ResetPasswordInput } from './dtos/reset-password.dto';
import { ForgotEmailInput } from './dtos/forgot-email.dto';
import { IGraphQLContext } from '../../types/graphql.types';
import { CreateSnsInput } from './dtos/create-sns.dto';
import { UpdateSnsInput } from './dtos/edit-sns.dto';
import { CreateDetailInput } from './dtos/create-detail.dto';
import { UpdateDetailInput } from './dtos/update-detail.dto';
import { Response } from 'express';
import { LoggerGuard } from '../../common/guards/logger.guard';
import { GqlLocalAuthGuard } from './gql-local-auth.guard';

@Resolver((of) => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {
  }

  @Query((returns) => Boolean)
  test() {
    return true;
  }

  @Mutation((returns) => User)
  register(@Args('input') registerInput: RegisterInput): Promise<User> {
    return this.authService.register(registerInput);
  }

  @Mutation((returns) => User)
  googleRegister(@Args('input') googleRegisterInput: GoogleRegisterInput) {
    return this.authService.googleRegister(googleRegisterInput);
  }

  @Mutation((returns) => LoginOutput)
  async login(
    @Context() ctx: IGraphQLContext,
    @Args('input') loginInput: LoginInput,
  ) {
    const token = await this.authService.login(loginInput);
    ctx.res.cookie('jwt', token, {
      secure: false,
    });
    return { token };
  }

  @UseGuards(GqlLocalAuthGuard)
  @Mutation((returns) => User)
  async localLogin(
    @Context() ctx: IGraphQLContext,
    @Args('input') loginInput: LoginInput,
  ) {
    return ctx.req.user;
  }

  @Mutation((returns) => LoginOutput)
  async googleLogin(
    @Context() ctx: IGraphQLContext,
    @Args('input') googleLoginInput: GoogleLoginInput,
  ) {
    const token = await this.authService.googleLogin(googleLoginInput);
    ctx.res.cookie('jwt', token, {
      secure: false,
    });
    return { token };
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

  @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  createSns(
    @CurrentUser() user: User,
    @Args('input') createSnsInput: CreateSnsInput,
  ) {
    return this.authService.createSns(user, createSnsInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  updateSns(
    @CurrentUser() user: User,
    @Args('input') updateSnsInput: UpdateSnsInput,
  ) {
    return this.authService.updateSns(user, updateSnsInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  createDetail(
    @CurrentUser() user: User,
    @Args('input') createDetailInput: CreateDetailInput,
  ) {
    return this.authService.createDetail(user, createDetailInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  updateDetail(
    @CurrentUser() user: User,
    @Args('input') updateDetailInput: UpdateDetailInput,
  ) {
    return this.authService.updateDetail(user, updateDetailInput);
  }

  @ResolveField()
  sns(@Parent() user: User, @Context() ctx: IGraphQLContext) {
    return ctx.snsLoader.load(user.id);
  }

  @ResolveField()
  detail(@Parent() user: User, @Context() ctx: IGraphQLContext) {
    return ctx.detailLoader.load(user.id);
  }

  /**
   query {
      me {
        id
        subscriptions {
          subscriberId
          subscribedToId
        }
        subscribers {
          subscriberId
          subscribedToId
        }
      }
    }
   */

  // 내가 구독하는 사람
  @ResolveField()
  subscriptions(@Parent() user: User, @Context() ctx: IGraphQLContext) {
    // 내가 구독하는 사람들이기 때문에 subscription table의 subscribedToId에서 내 유저 아이디를 찾는다.
    return ctx.subscribedToLoader.load(user.id);
  }

  // 나를 구독하는 사람
  @ResolveField()
  subscribers(@Parent() user: User, @Context() ctx: IGraphQLContext) {
    // 나를 구독하는 사람들이기 때문에 subscription table의 subscriberId에서 내 유저 아이디를 찾는다.
    return ctx.subscriberLoader.load(user.id);
  }
}
