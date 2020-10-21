import { ArgsType, Field, InputType, PickType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';

@ArgsType()
export class LikeArgs {
  @Field((type) => Int)
  @IsNotEmpty()
  @IsNumber()
  boardId: number;
}
