import { ObjectType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/MutationOutput.dto';
import { User } from '../entities/user.entitiy';

@ObjectType()
export class UserOutput extends MutationOutput(User) {}

