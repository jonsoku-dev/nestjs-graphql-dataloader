import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/entities/user.entitiy';
import { BoardLike } from './entities/board-like.entitiy';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { LikeArgs } from './dtos/like.dto';
import { BoardLikeService } from './board-like.service';

@Resolver((of) => BoardLike)
export class BoardLikeResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly likeService: BoardLikeService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  async like(@Args() likeArgs: LikeArgs, @CurrentUser() user: User) {
    return this.likeService.like(likeArgs, user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  async unlike(@Args() likeArgs: LikeArgs, @CurrentUser() user: User) {
    return this.likeService.unlike(likeArgs, user);
  }

  @ResolveField('user', (returns) => User)
  async likeUser(@Parent() like: BoardLike) {
    return this.authService.findOneById(like.userId);
  }
}
