import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateNoticeInput } from './create-notice.dto';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UpdateNoticeInput extends PartialType(CreateNoticeInput) {
  @Field((type) => String)
  @IsString()
  @IsNotEmpty()
  noticeId: string;
}
