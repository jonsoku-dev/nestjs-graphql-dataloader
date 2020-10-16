import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

export function MutationOutput<T>(classRef: Type<T>): any {
  @ObjectType(`${classRef.name}Error`)
  abstract class ErrorType {
    @Field((type) => String, { nullable: true })
    message?: string;

    @Field((type) => Number, { nullable: true })
    status?: number;
  }

  @ObjectType({ isAbstract: true })
  abstract class Result {
    @Field((type) => Boolean)
    ok: boolean;

    @Field((type) => classRef, { nullable: true })
    data?: T;

    @Field((type) => ErrorType, { nullable: true })
    error?: ErrorType;
  }

  return Result;
}
