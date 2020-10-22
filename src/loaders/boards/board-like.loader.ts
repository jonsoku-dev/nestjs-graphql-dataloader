import * as DataLoader from 'dataloader';
import { getRepository } from 'typeorm';
import { BoardLike } from '../../boards/board-like/entities/board-like.entitiy';

export const BoardLikeLoader = () =>
  new DataLoader(async (keys: string[]) => {
    const likes = await getRepository(BoardLike)
      .createQueryBuilder()
      .where('boardId IN (:...keys)', { keys })
      .getMany();

    return keys.map((key) => likes.filter((like) => like.boardId === key));
  });
