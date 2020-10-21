import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateBoardInput } from './create-board.dto';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UpdateBoardInput extends PartialType(CreateBoardInput) {
  @Field((type) => String)
  @IsString()
  @IsNotEmpty()
  boardId: string;
}
