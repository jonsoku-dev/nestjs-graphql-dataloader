import { InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { Board } from './board.entity';
import { User } from '../../auth/entities/user.entitiy';

@InputType({ isAbstract: true })
@ObjectType({ isAbstract: true })
@Entity()
export class Like extends CoreEntity {
  @Column()
  boardId: number;
  @ManyToOne((type) => Board, (board) => board.likes)
  @JoinColumn({ name: 'boardId' })
  board: Board;

  @Column()
  userId: number;
  @ManyToOne((type) => User, (user) => user.likes)
  @JoinColumn({ name: 'userId' })
  user: User;
}
