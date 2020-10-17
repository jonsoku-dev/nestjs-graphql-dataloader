import { InputType, PickType } from '@nestjs/graphql';
import { Board } from '../entities/board.entity';

@InputType()
export class CreateBoardInput extends PickType(Board, [
  'title',
  'description',
]) {}
