import * as DataLoader from 'dataloader';
import { getRepository } from 'typeorm';
import { Board } from '../../boards/board/entities/board.entity';

export const BoardCommentLoader = () =>
  new DataLoader(async (keys: string[]) => {
    const boards = await getRepository(Board)
      .createQueryBuilder('board')
      .leftJoinAndSelect('board.comments', 'comments')
      .where('board.id IN (:...keys)', { keys })
      .getMany();

    return boards.map((board) => board.comments);
  });
