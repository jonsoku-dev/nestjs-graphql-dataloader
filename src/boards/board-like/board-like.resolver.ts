import {
  Args,
  Context,
  Mutation,
  ResolveProperty,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { User } from '../../auth/entities/user.entitiy';
import { BoardLike } from './entities/board-like.entitiy';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/gql-auth.guard';
import { CurrentUser } from '../../auth/current-user.decorator';
import { LikeArgs } from './dtos/like.dto';
import { BoardLikeService } from './board-like.service';
import { IGraphQLContext } from '../../types/graphql.types';

@Resolver((of) => BoardLike)
export class BoardLikeResolver {
  constructor(private readonly likeService: BoardLikeService) {}

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

  @ResolveProperty('user')
  async user(@Root() like: BoardLike, @Context() ctx: IGraphQLContext) {
    return await ctx.userLoader.load(like.userId);
  }
}
