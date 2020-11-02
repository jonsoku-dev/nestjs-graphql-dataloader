import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { CursorPagination } from '../../../common/dtos/CursorPagination.dto';
import { Notice } from '../notice.entitiy';

@ArgsType()
export class GetNoticeListFilter {
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
}

@ObjectType()
export class GetNoticeListOutput extends CursorPagination(Notice) {}
