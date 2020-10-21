import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { Board } from './board.entity';
import { User } from '../../auth/entities/user.entitiy';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType({ isAbstract: true })
@ObjectType({ isAbstract: true })
@Entity()
export class Comment extends CoreEntity {
  @Column('longtext')
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  body: string;

  @Field(() => Int)
  @Column()
  boardId: number;
  @Field(() => Board)
  @ManyToOne((type) => Board, (board) => board.likes)
  @JoinColumn({ name: 'boardId' })
  board: Board;

  @Field(() => Int)
  @Column()
  userId: number;
  @Field(() => User)
  @ManyToOne((type) => User, (user) => user.likes)
  @JoinColumn({ name: 'userId' })
  user: User;
}
