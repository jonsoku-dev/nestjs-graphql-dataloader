import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { User } from '../../auth/entities/user.entitiy';
import { IsNotEmpty, IsString } from 'class-validator';
import { Board } from '../../board/entities/board.entity';

@InputType({ isAbstract: true })
@ObjectType({ isAbstract: true })
@Entity()
export class BoardComment extends CoreEntity {
  @Column('longtext')
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  body: string;

  @Field(() => String)
  @Column()
  boardId: string;
  @Field(() => Board)
  @ManyToOne((type) => Board, (board) => board.likes, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'boardId' })
  board: Board;

  @Field(() => String)
  @Column()
  userId: string;
  @Field(() => User)
  @ManyToOne((type) => User, (user) => user.likes, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;
}
