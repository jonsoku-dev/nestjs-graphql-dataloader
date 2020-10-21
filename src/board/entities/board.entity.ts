import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from '../../common/entities/core.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm/index';
import { IsEnum, IsString } from 'class-validator';
import { JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entitiy';
import { Like } from './like.entity';
import { Comment } from './comment.entitiy';

export enum BoardCategory {
  FREE,
  FQ,
  JOB,
  TRADE,
}

registerEnumType(BoardCategory, {
  name: 'BoardCategory',
});

@InputType({ isAbstract: true })
@ObjectType({ isAbstract: true })
@Entity()
export class Board extends CoreEntity {
  @Field(() => String)
  @IsString()
  @Column()
  title: string;

  @Field(() => String)
  @IsString()
  @Column('longtext')
  description: string;

  @Field(() => BoardCategory)
  @IsEnum(BoardCategory)
  @Column()
  category: BoardCategory;

  @Column()
  userId: number;
  @Field(() => User)
  @ManyToOne((type) => User, (user) => user.boards)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany((type) => Like, (like) => like.board)
  likes: Like[];
  @OneToMany((type) => Comment, (comment) => comment.board)
  comments: Comment[];
}
