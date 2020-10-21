import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateBoardCommentInput } from './create-board-comment.dto';

@InputType()
export class UpdateBoardCommentInput extends PartialType(
  CreateBoardCommentInput,
) {
  @Field((type) => String)
  @IsNotEmpty()
  @IsString()
  commentId: string;
}
