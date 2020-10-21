import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsPositive, IsString } from 'class-validator';
import { Board, BoardCategory } from '../entities/board.entity';
import { CursorPagination } from '../../common/dtos/CursorPagination.dto';

@InputType()
export class GetBoardListFilter {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsPositive()
  after: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsPositive()
  first: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  keyword: string;

  @Field(() => BoardCategory, { nullable: true })
  @IsOptional()
  @IsEnum(BoardCategory)
  category: BoardCategory;
}

@ObjectType()
export class GetBoardListOutput extends CursorPagination(Board) {}
