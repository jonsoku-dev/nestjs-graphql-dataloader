import {
  ConflictException,
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
import { User } from '../auth/entities/user.entitiy';
import { UpdateBoardInput } from './dtos/update-board.dto';
import { DeleteBoardArgs } from './dtos/delete-board.dto';
import { Like } from './entities/like.entity';
import { LikeArgs } from './dtos/like.dto';
import { CreateBoardCommentInput } from './dtos/create-board-comment.dto';
import { Comment } from './entities/comment.entitiy';
import { UpdateBoardCommentInput } from './dtos/update-board-comment.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async getBoardList({ after, first, keyword, category }: GetBoardListFilter) {
    try {
      let limit = 2;
      const query = this.boardRepository.createQueryBuilder('board').select();

      if (after) {
        query.andWhere('board.id < :after', { after });
      }
      if (first) {
        limit = first;
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

  async getBoard(boardId: number) {
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
        .where('id = :id', { id: boardId })
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
        .where('id = :id', {
          id: boardId,
        })
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
        .where('id = :id', { id: boardId })
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
        .where('id = :id', {
          id: boardId,
        })
        .execute();

      return boardId;
    } catch (e) {
      console.error(e);
      throw new HttpException(e.response, e.status);
    }
  }

  async like({ boardId }: LikeArgs, user: User) {
    try {
      const query = this.likeRepository.createQueryBuilder('like');

      const found = await query
        .select()
        .andWhere('like.boardId = :boardId', { boardId })
        .andWhere('like.userId = :userId', { userId: user.id })
        .getOne();

      if (found) {
        throw new ConflictException();
      }

      await query
        .insert()
        .into(Like)
        .values({
          user,
          boardId,
        })
        .execute();
      return boardId;
    } catch (e) {
      console.error(e);
      throw new HttpException(e.response, e.status);
    }
  }

  async unlike({ boardId }: LikeArgs, user: User) {
    try {
      const query = this.likeRepository.createQueryBuilder('like');

      const found = await query
        .select()
        .andWhere('like.boardId = :boardId', { boardId })
        .andWhere('like.userId = :userId', { userId: user.id })
        .getOne();

      if (!found) {
        throw new NotFoundException();
      }

      await query
        .delete()
        .from(Like)
        .andWhere('like.boardId = :boardId', { boardId })
        .andWhere('like.userId = :userId', { userId: user.id })
        .execute();
      return boardId;
    } catch (e) {
      console.error(e);
      throw new HttpException(e.response, e.status);
    }
  }

  async createBoardComment(
    { boardId, body }: CreateBoardCommentInput,
    user: User,
  ) {
    try {
      const foundBoard = await this.boardRepository.findOne({ id: boardId });
      if (!foundBoard) {
        throw new NotFoundException();
      }
      return await this.commentRepository
        .create({
          boardId,
          user,
          body,
        })
        .save();
    } catch (e) {
      console.error(e);
      throw new HttpException(e.response, e.status);
    }
  }

  async updateBoardComment(
    { commentId, body }: UpdateBoardCommentInput,
    user: User,
  ) {
    try {
      const foundComment = await this.commentRepository.findOne({
        id: commentId,
      });
      if (!foundComment) {
        throw new NotFoundException();
      }
      if (foundComment.userId !== user.id) {
        throw new UnauthorizedException();
      }
      await this.commentRepository
        .createQueryBuilder('comment')
        .update(Comment)
        .set({ body })
        .where('comment.id = :id', {
          id: commentId,
        })
        .execute();

      return this.commentRepository.findOne({ id: commentId });
    } catch (e) {
      console.error(e);
      throw new HttpException(e.response, e.status);
    }
  }

  async findLikesByBoard(boardId: number) {
    return this.likeRepository.find({ where: { boardId } });
  }

  async findCommentsByBoard(boardId: number) {
    return this.commentRepository.find({ where: { boardId } });
  }
}
