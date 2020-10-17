import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

export const CursorPagination = <T>(classRef: Type<T>): any => {
  @ObjectType(`${classRef.name}Edge`)
  abstract class EdgeType {
    @Field(() => String)
    cursor: string;

    @Field(() => classRef)
    node: T;
  }

  @ObjectType(`${classRef.name}PageInfo`)
  abstract class PageInfoType {
    @Field(() => Boolean, { nullable: true })
    hasNextPage: boolean;

    @Field(() => String, { nullable: true })
    startCursor: string;

    @Field(() => String, { nullable: true })
    endCursor: string;
  }

  @ObjectType({ isAbstract: true })
  abstract class CursorPaginationType {
    @Field(() => [EdgeType], { nullable: true })
    edges: EdgeType[];

    @Field(() => PageInfoType, { nullable: true })
    pageInfo: PageInfoType;
  }

  return CursorPaginationType;
};
