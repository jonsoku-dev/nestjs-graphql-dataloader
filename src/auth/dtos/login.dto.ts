import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entitiy';
import { MutationOutput } from '../../common/dtos/MutationOutput.dto';

@InputType()
export class LoginInput extends PickType(User, ['email', 'password']) {}

@ObjectType()
export class Token {
  @Field()
  token: string;
}

@ObjectType()
export class LoginOutput extends MutationOutput(Token) {}
