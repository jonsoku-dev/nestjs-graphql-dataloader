import { InputType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entitiy';

@InputType()
export class GenerateCodeAndSendMailInput extends PickType(User, ['email']) {}
