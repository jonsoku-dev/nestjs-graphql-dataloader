import { Column, Entity, BeforeInsert, BeforeUpdate } from 'typeorm/index';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from '../../common/entities/core.entity';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import * as bcrypt from 'bcryptjs';
import { InternalServerErrorException } from '@nestjs/common';
import { Exclude } from 'class-transformer';

enum UserRole {
  Client,
  Admin,
}

registerEnumType(UserRole, {
  name: 'UserRole',
});

@InputType({ isAbstract: true })
@ObjectType({ isAbstract: true })
@Entity()
export class User extends CoreEntity {
  @Field((type) => String)
  @IsString()
  @IsNotEmpty()
  @Length(4, 16)
  @Column()
  username: string;

  @Field((type) => String)
  @IsEmail()
  @IsNotEmpty()
  @Length(0, 40)
  @Column({ unique: true })
  email: string;

  @Field((type) => String)
  @IsString()
  @IsNotEmpty()
  @Length(4, 255)
  @Exclude({ toPlainOnly: true })
  @Column({ select: false })
  password: string;

  @Field((type) => UserRole, { defaultValue: UserRole.Client })
  @IsEnum(UserRole)
  @IsOptional()
  @Column({ type: 'enum', enum: UserRole, default: UserRole.Client })
  role?: UserRole;

  @Field((type) => Number, { nullable: true })
  @IsNumber()
  @IsOptional()
  @Exclude()
  @Column({ nullable: true })
  passwordSecretCode?: number;

  @Field((type) => Boolean, { nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  @Exclude()
  @Column({ nullable: true, default: false })
  passwordConfirmSecretCode?: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  async hashedPassword() {
    try {
      if (this.password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
      }
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }

  async validatePassword(aPassword: string) {
    try {
      return await bcrypt.compare(aPassword, this.password);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }
}
