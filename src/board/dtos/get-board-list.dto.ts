import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsPositive } from 'class-validator';
import { Board } from '../entities/board.entity';
import { CursorPagination } from '../../common/dtos/CursorPagination.dto';
import { MutationOutput } from '../../common/dtos/MutationOutput.dto';

@InputType()
export class GetBoardListFilter {
  @Field(() => Number)
  @IsOptional()
  @IsPositive()
  after?: number;

  @Field(() => Number)
  @IsOptional()
  @IsPositive()
  first?: number;
}

@ObjectType({ isAbstract: true })
export class CursorPaginatedBoardList extends CursorPagination(Board) {}

@ObjectType()
export class GetBoardListOutput extends MutationOutput(
  CursorPaginatedBoardList,
) {}
