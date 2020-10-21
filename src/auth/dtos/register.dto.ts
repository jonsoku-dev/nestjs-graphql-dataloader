import { Field, InputType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entitiy';
import { IsNotEmpty, IsString, Length } from 'class-validator';

@InputType()
export class RegisterInput extends PickType(User, [
  'username',
  'email',
  'role',
]) {
  @Field((type) => String)
  @IsString()
  @IsNotEmpty()
  @Length(4, 255)
  password: string;
}
