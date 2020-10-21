import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';

@ArgsType()
export class DeleteBoardArgs {
  @Field(() => Number)
  @IsNumber()
  @IsNotEmpty()
  boardId: number;
}
