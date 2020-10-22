import { InputType, PickType } from '@nestjs/graphql';
import { Notice } from '../notice.entitiy';

@InputType()
export class CreateNoticeInput extends PickType(Notice, [
  'title',
  'description',
  'imageUrl',
]) {}
