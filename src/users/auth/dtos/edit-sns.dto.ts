import { InputType, PartialType } from '@nestjs/graphql';
import { CreateSnsInput } from './create-sns.dto';

@InputType()
export class UpdateSnsInput extends PartialType(CreateSnsInput) {}
