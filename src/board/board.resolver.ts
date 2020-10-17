import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BoardOutput } from './dtos/shared.dto';
import { BoardService } from './board.service';
import { CreateBoardInput } from './dtos/create-board.dto';
import { GetBoardListFilter, GetBoardListOutput } from './dtos/get-board-list.dto';

@Resolver()
export class BoardResolver {
  constructor(private readonly service: BoardService) {}

  @Query(() => GetBoardListOutput)
  getBoardList(
    @Args('filter', { nullable: true }) getBoardListFilter: GetBoardListFilter,
  ): Promise<GetBoardListOutput> {
    return this.service.getBoardList(getBoardListFilter);
  }

  @Query(() => BoardOutput)
  getBoard(@Args('boardId') boardId: number): Promise<BoardOutput> {
    return this.service.getBoard(boardId);
  }

  @Mutation(() => BoardOutput)
  createBoard(
    @Args('input') createBoardInput: CreateBoardInput,
  ): Promise<BoardOutput> {
    console.log('hey');
    return this.service.createBoard(createBoardInput);
  }
}
