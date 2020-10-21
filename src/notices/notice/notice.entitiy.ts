import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from '../../common/entities/core.entity';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { User } from '../../auth/entities/user.entitiy';

@InputType({ isAbstract: true })
@ObjectType({ isAbstract: true })
@Entity()
export class Notice extends CoreEntity {
  @Field((type) => String)
  @IsString()
  @IsNotEmpty()
  @Length(1, 80)
  @Column()
  title: string;

  @Field((type) => String)
  @IsString()
  @IsNotEmpty()
  @Length(1, 960)
  @Column()
  description: string;

  @Field((type) => String, { nullable: true })
  @IsString()
  @IsOptional()
  @Column({ nullable: true })
  imageUrl: string;

  @Field((type) => String)
  @Column()
  userId: string;
  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.notices)
  @JoinColumn({ name: 'userId' })
  user: User;
}