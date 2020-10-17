import { ObjectType } from '@nestjs/graphql';
import { MutationOutput } from '../../common/dtos/MutationOutput.dto';
import { Board } from '../entities/board.entity';

@ObjectType()
export class BoardOutput extends MutationOutput(Board) {}

