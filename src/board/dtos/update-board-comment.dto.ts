import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateBoardCommentInput } from './create-board-comment.dto';

@InputType()
export class UpdateBoardCommentInput extends PartialType(
  CreateBoardCommentInput,
) {
  @Field((type) => Int)
  @IsNotEmpty()
  @IsNumber()
  commentId: number;
}
