import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from '../../common/entities/core.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm/index';
import { IsEnum, IsString } from 'class-validator';
import { JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entitiy';
import { BoardLike } from '../../board-like/entities/board-like.entitiy';
import { BoardComment } from '../../board-comment/entities/board-comment.entity';

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

  @Field(() => String)
  @Column()
  userId: string;
  @Field(() => User)
  @ManyToOne((type) => User, (user) => user.boards, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany((type) => BoardLike, (like) => like.board)
  likes: BoardLike[];
  @OneToMany((type) => BoardComment, (comment) => comment.board)
  comments: BoardComment[];
}
