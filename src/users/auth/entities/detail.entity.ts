import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsBoolean, IsOptional, IsString, Max } from 'class-validator';
import { User } from './user.entitiy';

@InputType({ isAbstract: true })
@ObjectType({ isAbstract: true })
@Entity()
export class Detail {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => Boolean, { defaultValue: false })
  @IsBoolean()
  @Column({ default: false })
  status: boolean;

  @Field(() => String)
  @IsString()
  @IsOptional()
  @Max(30)
  @Column({ length: 30 })
  company: string;

  @Field(() => String)
  @IsString()
  @IsOptional()
  @Max(1000)
  @Column({ length: 1000 })
  introduce: string;

  @Field(() => String)
  @Column()
  userId: string;
  @OneToOne((type) => User, (user) => user.sns)
  @JoinColumn({ name: 'userId' })
  user: User;
}
