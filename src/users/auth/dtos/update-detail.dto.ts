import { InputType, PartialType } from '@nestjs/graphql';
import { CreateDetailInput } from './create-detail.dto';

@InputType()
export class UpdateDetailInput extends PartialType(CreateDetailInput) {}
