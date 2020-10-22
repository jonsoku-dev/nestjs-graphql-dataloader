import * as DataLoader from 'dataloader';
import { getRepository } from 'typeorm';
import { BoardComment } from '../../boards/board-comment/entities/board-comment.entity';

export const BoardCommentLoader = () =>
  new DataLoader(async (keys: string[]) => {
    const comments = await getRepository(BoardComment)
      .createQueryBuilder()
      .where('boardId IN (:...keys)', { keys })
      .getMany();

    return keys.map((key) => comments.filter((c) => c.boardId === key));
  });
