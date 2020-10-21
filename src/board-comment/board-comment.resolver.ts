import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/entities/user.entitiy';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CreateBoardCommentInput } from './dtos/create-board-comment.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { UpdateBoardCommentInput } from './dtos/update-board-comment.dto';
import { BoardCommentService } from './board-comment.service';
import { BoardComment } from './entities/board-comment.entity';

@Resolver(() => BoardComment)
export class BoardCommentResolver {
  constructor(
    private readonly commentService: BoardCommentService,
    private readonly authService: AuthService,
  ) {}

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

  // @ResolveField('user', (returns) => User)
  // async commentUser(@Parent() comment: BoardComment) {
  //   return this.authService.findOneById(comment.userId);
  // }
}
