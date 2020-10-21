import { Field, InputType, PickType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { BoardComment } from '../entities/board-comment.entity';

@InputType()
export class CreateBoardCommentInput extends PickType(BoardComment, ['body']) {
  @Field((type) => String)
  @IsNotEmpty()
  @IsString()
  boardId: string;
}
