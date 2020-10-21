import { Field, InputType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entitiy';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class ResetPasswordInput extends PickType(User, ['confirmCode']) {
  @Field((type) => String)
  @IsString()
  @IsNotEmpty()
  password: string;
}
