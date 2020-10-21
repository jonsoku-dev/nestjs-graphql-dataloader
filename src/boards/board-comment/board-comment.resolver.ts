import {
  Args,
  Context,
  Mutation,
  ResolveProperty,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { User } from '../../auth/entities/user.entitiy';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/gql-auth.guard';
import { CreateBoardCommentInput } from './dtos/create-board-comment.dto';
import { CurrentUser } from '../../auth/current-user.decorator';
import { UpdateBoardCommentInput } from './dtos/update-board-comment.dto';
import { BoardCommentService } from './board-comment.service';
import { BoardComment } from './entities/board-comment.entity';
import { IGraphQLContext } from '../../types/graphql.types';

@Resolver(() => BoardComment)
export class BoardCommentResolver {
  constructor(private readonly commentService: BoardCommentService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => BoardComment)
  createBoardComment(
    @Args('input') createBoardCommentInput: CreateBoardCommentInput,
    @CurrentUser() user: User,
  ) {
    return this.commentService.createBoardComment(
      createBoardCommentInput,
      user,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => BoardComment)
  updateBoardComment(
    @Args('input') updateBoardCommentInput: UpdateBoardCommentInput,
    @CurrentUser() user: User,
  ) {
    return this.commentService.updateBoardComment(
      updateBoardCommentInput,
      user,
    );
  }

  @ResolveProperty('user')
  async user(@Root() comment: BoardComment, @Context() ctx: IGraphQLContext) {
    return await ctx.userLoader.load(comment.userId);
  }
}
