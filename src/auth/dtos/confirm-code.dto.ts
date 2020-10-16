import { ArgsType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@ArgsType()
export class ConfirmCodeArg {
  @Field((type) => String)
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @Field((type) => Number)
  @IsNumber()
  @IsNotEmpty()
  passwordSecretCode: number;
}
