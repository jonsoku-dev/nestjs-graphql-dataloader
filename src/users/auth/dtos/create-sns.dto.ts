import { InputType, PickType } from '@nestjs/graphql';
import { Sns } from '../entities/sns.entity';

@InputType()
export class CreateSnsInput extends PickType(Sns, [
  'facebook',
  'line',
  'kakaotalk',
  'twitter',
  'instagram',
]) {}
