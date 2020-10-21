import { InputType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entitiy';

@InputType()
export class ForgotEmailInput extends PickType(User, ['username']) {}
