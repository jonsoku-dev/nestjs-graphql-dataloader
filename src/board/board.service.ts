import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Repository } from 'typeorm/index';
import { CreateBoardInput } from './dtos/create-board.dto';
import { GetBoardListFilter } from './dtos/get-board-list.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async getBoardList({ after, first }: GetBoardListFilter) {
    let limit = 2;
    const query = this.boardRepository.createQueryBuilder('board').select();

    if (after) {
      query.andWhere('board.id < :after', { after });
    }
    if (first) {
      limit = first;
    }

    let boardList = await query
      .take(limit + 1)
      .orderBy('board.id', 'DESC')
      .getMany();

    if (boardList.length === 0) {
      throw new NotFoundException();
    } else {
      const hasNextPage = boardList.length > limit;
      boardList = hasNextPage ? boardList.slice(0, -1) : boardList;
      const edges = boardList.map((board) => ({
        node: board,
        cursor: board.id,
      }));
      console.log(edges);
      return {
        ok: true,
        data: {
          edges,
          pageInfo: {
            hasNextPage: hasNextPage,
            startCursor: boardList[0].id,
            endCursor: hasNextPage ? boardList[boardList.length - 1].id : null,
          },
        },
      };
    }
  }

  async getBoard(boardId: number) {
    const found = await this.boardRepository.findOne({
      where: {
        id: boardId,
      },
    });
    if (!found) {
      throw new NotFoundException();
    }
    return {
      ok: true,
      data: found,
    };
  }

  async createBoard(createBoardInput: CreateBoardInput) {
    const result = await this.boardRepository.create(createBoardInput).save();
    if (!result) {
      throw new ForbiddenException();
    } else {
      return {
        ok: true,
        data: result,
      };
    }
  }
}
