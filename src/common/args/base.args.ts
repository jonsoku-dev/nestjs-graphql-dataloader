import { ArgsType, Field, Int } from "@nestjs/graphql";
import GraphQLJson from "graphql-type-json";
import { FindConditions, ObjectLiteral, JoinOptions } from "typeorm";

@ArgsType()
export class FindOneArgs<T> {
  @Field(() => GraphQLJson, { nullable: true })
  join?: JoinOptions;
  @Field(() => GraphQLJson, { nullable: true })
  order?: { [P in keyof T]?: "ASC" | "DESC" | 1 | -1 };
  relations?: string[];
  select?: string[];
  @Field(() => GraphQLJson, { nullable: true })
  where?: FindConditions<T>[] | FindConditions<T> | ObjectLiteral;
}

@ArgsType()
export class FindArgs<T> extends FindOneArgs<T> {
  @Field(() => Int, { defaultValue: 0 })
  skip: number;
  @Field(() => Int, { defaultValue: 10 })
  take: number;
}