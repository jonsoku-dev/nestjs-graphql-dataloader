import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateBoardInput } from './create-board.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class UpdateBoardInput extends PartialType(CreateBoardInput) {
  @Field(type => Number)
  @IsNumber()
  @IsNotEmpty()
  boardId: number;
}
