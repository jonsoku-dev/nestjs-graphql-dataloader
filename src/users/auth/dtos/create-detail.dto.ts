import { InputType, OmitType, PickType } from '@nestjs/graphql';
import { Detail } from '../entities/detail.entity';

@InputType()
export class CreateDetailInput extends PickType(Detail, [
  'status',
  'company',
  'introduce',
]) {}
