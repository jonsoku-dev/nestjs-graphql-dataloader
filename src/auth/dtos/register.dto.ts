import { InputType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entitiy';

@InputType()
export class RegisterInput extends PickType(User, [
  'username',
  'email',
  'password',
  'role',
]) {}