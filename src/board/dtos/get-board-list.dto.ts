import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Board, BoardCategory } from '../entities/board.entity';
import { CursorPagination } from '../../common/dtos/CursorPagination.dto';

@InputType()
export class GetBoardListFilter {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  after: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  first: string;

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
