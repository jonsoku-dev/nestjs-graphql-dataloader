import { InputType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entitiy';

@InputType()
export class ResetPasswordInput extends PickType(User, ['email', 'password']) {}
