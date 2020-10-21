import { Field, InputType, Int, PickType } from '@nestjs/graphql';
import { Comment } from '../entities/comment.entitiy';
import { IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class CreateBoardCommentInput extends PickType(Comment, ['body']) {
  @Field((type) => Int)
  @IsNotEmpty()
  @IsNumber()
  boardId: number;
}
