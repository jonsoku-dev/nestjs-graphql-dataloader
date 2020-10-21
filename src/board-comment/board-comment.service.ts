import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateBoardCommentInput } from './dtos/create-board-comment.dto';
import { User } from '../auth/entities/user.entitiy';
import { UpdateBoardCommentInput } from './dtos/update-board-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from '../board/entities/board.entity';
import { Repository } from 'typeorm';
import { BoardComment } from './entities/board-comment.entity';

@Injectable()
export class BoardCommentService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(BoardComment)
    private readonly commentRepository: Repository<BoardComment>,
  ) {}

  async findAllById(boardId: string) {
    try {
      return await this.commentRepository.find({ where: { id: boardId } });
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
        .update(BoardComment)
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
}
