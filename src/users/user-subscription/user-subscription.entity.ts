import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { User } from '../auth/entities/user.entitiy';

@InputType({ isAbstract: true })
@ObjectType({ isAbstract: true })
@Entity()
export class UserSubscription extends CoreEntity {
  @Field(() => String)
  @Column()
  subscriberId: string;
  @Field(() => User)
  @ManyToOne(type => User, user => user.subscriptions)
  @JoinColumn({ name: 'subscriberId' })
  subscriber: User;

  @Field(() => String)
  @Column()
  subscribedToId: string;
  @Field(() => User)
  @ManyToOne(type => User, user => user.subscribers)
  @JoinColumn({ name: 'subscribedToId' })
  subscribedTo: User;
}