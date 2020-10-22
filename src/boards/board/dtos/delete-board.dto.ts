import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class DeleteBoardArgs {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  boardId: string;
}
