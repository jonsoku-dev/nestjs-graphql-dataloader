import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Repository } from 'typeorm/index';
import { CreateBoardInput } from './dtos/create-board.dto';
import { GetBoardListFilter } from './dtos/get-board-list.dto';
import { User } from '../../auth/entities/user.entitiy';
import { UpdateBoardInput } from './dtos/update-board.dto';
import { DeleteBoardArgs } from './dtos/delete-board.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async getBoardList({ after, first, keyword, category }: GetBoardListFilter) {
    try {
      let limit = 2;
      const query = this.boardRepository.createQueryBuilder('board').select();

      if (after) {
        query.andWhere('board.id < :after', { after });
      }
      if (first) {
        limit = parseInt(first, 10);
      }
      if (keyword) {
        query.andWhere('board.title LIKE :keyword', {
          keyword: `%${keyword}%`,
        });
      }
      if (category) {
        query.andWhere('board.category = :category', { category });
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
        return {
          edges,
          pageInfo: {
            hasNextPage: hasNextPage,
            startCursor: boardList[0].id,
            endCursor: hasNextPage ? boardList[boardList.length - 1].id : null,
          },
        };
      }
    } catch (e) {
      console.error(e);
      throw new HttpException(e.response, e.status);
    }
  }

  async getBoard(boardId: string) {
    try {
      const found = await this.boardRepository.findOne({
        where: {
          id: boardId,
        },
      });
      if (!found) {
        throw new NotFoundException();
      }
      return found;
    } catch (e) {
      console.error(e);
      throw new HttpException(e.response, e.status);
    }
  }

  async createBoard(createBoardInput: CreateBoardInput, user: User) {
    try {
      const newBoard = await this.boardRepository
        .create({
          user,
          ...createBoardInput,
        })
        .save();
      if (!newBoard) {
        throw new InternalServerErrorException('생성에 실패하였습니다.');
      }
      return newBoard;
    } catch (e) {
      console.error(e);
      throw new HttpException(e.response, e.status);
    }
  }

  async updateBoard({ boardId, ...other }: UpdateBoardInput, user: User) {
    try {
      const query = this.boardRepository.createQueryBuilder('board');

      const foundBoard = await query
        .select()
        .where('board.id = :boardId', { boardId })
        .getOne();

      if (!foundBoard) {
        throw new NotFoundException();
      }

      if (foundBoard.userId !== user.id) {
        throw new UnauthorizedException();
      }

      await query
        .update(Board)
        .set({
          ...other,
        })
        .where('board.id = :boardId', { boardId })
        .execute();

      return this.boardRepository.findOne({ id: boardId });
    } catch (e) {
      console.error(e);
      throw new HttpException(e.response, e.status);
    }
  }

  async deleteBoard({ boardId }: DeleteBoardArgs, user: User) {
    try {
      const query = this.boardRepository.createQueryBuilder('board');

      const foundBoard = await query
        .select()
        .where('board.id = :boardId', { boardId })
        .getOne();

      if (!foundBoard) {
        throw new NotFoundException();
      }

      if (foundBoard.userId !== user.id) {
        throw new UnauthorizedException();
      }

      await query
        .delete()
        .from(Board)
        .where('board.id = :boardId', { boardId })
        .execute();

      return boardId;
    } catch (e) {
      console.error(e);
      throw new HttpException(e.response, e.status);
    }
  }
}
