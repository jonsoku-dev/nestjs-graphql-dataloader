import { Request, Response } from 'express';
import * as DataLoader from 'dataloader';
import { BoardLike } from '../board-like/entities/board-like.entitiy';
import { BoardComment } from '../board-comment/entities/board-comment.entity';
import { User } from '../auth/entities/user.entitiy';

export interface IGraphQLContext {
  req: Request;
  res: Response;
  boardLikeLoader: DataLoader<string, BoardLike[]>;
  boardCommentLoader: DataLoader<string, BoardComment[]>;
  boardUserLoader: DataLoader<string, User[]>;
}
