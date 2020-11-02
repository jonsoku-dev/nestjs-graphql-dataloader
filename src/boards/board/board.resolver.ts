import {
  Args,
  Context,
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
import { GqlAuthGuard } from '../../users/auth/gql-auth.guard';
import { CurrentUser } from '../../users/auth/current-user.decorator';
import { User } from '../../users/auth/entities/user.entitiy';
import { BoardService } from './board.service';
import { Board } from './entities/board.entity';
import { UpdateBoardInput } from './dtos/update-board.dto';
import { DeleteBoardArgs } from './dtos/delete-board.dto';
import { IGraphQLContext } from '../../types/graphql.types';
import { BoardLike } from '../board-like/entities/board-like.entitiy';
import { BoardComment } from '../board-comment/entities/board-comment.entity';
import { FileUpload } from 'graphql-upload';
import { GraphQLUpload } from 'apollo-server-express';

@Resolver(() => Board)
export class BoardResolver {
  constructor(private readonly boardService: BoardService) {
  }

  @Query(() => GetBoardListOutput)
  getBoardList(
    @Args() getBoardListFilter: GetBoardListFilter,
  ): Promise<GetBoardListOutput> {
    console.log(getBoardListFilter.category === 0);
    return this.boardService.getBoardList(getBoardListFilter);
  }

  @Query(() => Board)
  getBoard(@Args('boardId') boardId: string): Promise<Board> {
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

  @Mutation(() => String)
  uploadBoardImage(
    @Args('boardId') boardId: string,
    @Args({ name: 'file', type: () => GraphQLUpload })
      file: FileUpload,
  ) {
    return this.boardService.uploadImage(boardId, file);
  }

  @ResolveField('user', (returns) => User)
  async getUser(@Parent() board: Board, @Context() ctx: IGraphQLContext) {
    return await ctx.userLoader.load(board.userId);
  }

  @ResolveField('likes', (returns) => [BoardLike])
  async getLikes(@Parent() board: Board, @Context() ctx: IGraphQLContext) {
    return await ctx.boardLikeLoader.load(board.id);
  }

  @ResolveField('comments', (returns) => [BoardComment])
  async getComments(@Parent() board: Board, @Context() ctx: IGraphQLContext) {
    return await ctx.boardCommentLoader.load(board.id);
  }
}
