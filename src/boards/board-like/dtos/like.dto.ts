import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@ArgsType()
export class LikeArgs {
  @Field((type) => String)
  @IsNotEmpty()
  @IsString()
  boardId: string;
}
