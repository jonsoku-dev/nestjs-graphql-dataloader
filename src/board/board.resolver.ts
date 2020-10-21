import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CreateBoardInput } from './dtos/create-board.dto';
import {
  GetBoardListFilter,
  GetBoardListOutput,
} from './dtos/get-board-list.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../auth/entities/user.entitiy';
import { AuthService } from '../auth/auth.service';
import { BoardService } from './board.service';
import { Board } from './entities/board.entity';
import { UpdateBoardInput } from './dtos/update-board.dto';
import { DeleteBoardArgs } from './dtos/delete-board.dto';
import { LikeArgs } from './dtos/like.dto';
import { CreateBoardCommentInput } from './dtos/create-board-comment.dto';
import { Comment } from './entities/comment.entitiy';
import { UpdateBoardCommentInput } from './dtos/update-board-comment.dto';
import { Like } from './entities/like.entity';

@Resolver(() => Board)
export class BoardResolver {
  constructor(
    private readonly boardService: BoardService,
    private readonly authService: AuthService,
  ) {}

  @Query(() => GetBoardListOutput)
  getBoardList(
    @Args('filter', { nullable: true }) getBoardListFilter: GetBoardListFilter,
  ): Promise<GetBoardListOutput> {
    return this.boardService.getBoardList(getBoardListFilter);
  }

  @Query(() => Board)
  getBoard(@Args('boardId') boardId: number): Promise<Board> {
    return this.boardService.getBoard(boardId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Board)
  createBoard(
    @Args('input') createBoardInput: CreateBoardInput,
    @CurrentUser() user: User,
  ): Promise<Board> {
    return this.boardService.createBoard(createBoardInput, user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Board)
  updateBoard(
    @Args('input') updateBoardInput: UpdateBoardInput,
    @CurrentUser() user: User,
  ) {
    return this.boardService.updateBoard(updateBoardInput, user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  deleteBoard(
    @Args() deleteBoardArgs: DeleteBoardArgs,
    @CurrentUser() user: User,
  ) {
    return this.boardService.deleteBoard(deleteBoardArgs, user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  like(@Args() likeArgs: LikeArgs, @CurrentUser() user: User) {
    return this.boardService.like(likeArgs, user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  unlike(@Args() likeArgs: LikeArgs, @CurrentUser() user: User) {
    return this.boardService.unlike(likeArgs, user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Comment)
  createBoardComment(
    @Args('input') createBoardCommentInput: CreateBoardCommentInput,
    @CurrentUser() user: User,
  ) {
    return this.boardService.createBoardComment(createBoardCommentInput, user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Comment)
  updateBoardComment(
    @Args('input') updateBoardCommentInput: UpdateBoardCommentInput,
    @CurrentUser() user: User,
  ) {
    return this.boardService.updateBoardComment(updateBoardCommentInput, user);
  }

  @ResolveField('user', (returns) => User)
  async boardUser(@Parent() board: Board) {
    return this.authService.findOneById(board.userId);
  }

  @ResolveField('likes', (returns) => [Like])
  async boardLikes(@Parent() board: Board) {
    return this.boardService.findLikesByBoard(board.id);
  }

  @ResolveField('comments', (returns) => [Comment])
  async boardComments(@Parent() board: Board) {
    return this.boardService.findCommentsByBoard(board.id);
  }
}
