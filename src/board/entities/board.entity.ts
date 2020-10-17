import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from '../../common/entities/core.entity';
import { Column, Entity } from 'typeorm/index';
import { IsString } from 'class-validator';

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
}
