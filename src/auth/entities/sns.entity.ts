import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsOptional, IsString, Max } from 'class-validator';
import { User } from './user.entitiy';

@InputType({ isAbstract: true })
@ObjectType({ isAbstract: true })
@Entity()
export class Sns {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => String)
  @IsString()
  @IsOptional()
  @Column({ length: 30 })
  facebook: string;

  @Field(() => String)
  @IsString()
  @IsOptional()
  @Max(30)
  @Column({ length: 30 })
  line: string;

  @Field(() => String)
  @IsString()
  @IsOptional()
  @Max(30)
  @Column({ length: 30 })
  kakaotalk: string;

  @Field(() => String)
  @IsString()
  @IsOptional()
  @Max(30)
  @Column({ length: 30 })
  twitter: string;

  @Field(() => String)
  @IsString()
  @IsOptional()
  @Max(30)
  @Column({ length: 30 })
  instagram: string;

  @Field(() => String)
  @Column()
  userId: string;
  @OneToOne((type) => User, (user) => user.sns)
  @JoinColumn({ name: 'userId' })
  user: User;
}
