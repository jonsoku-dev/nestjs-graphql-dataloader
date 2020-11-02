import { Args, Context, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UserSubscription } from './user-subscription.entity';
import { User } from '../auth/entities/user.entitiy';
import { IGraphQLContext } from '../../types/graphql.types';
import { CurrentUser } from '../auth/current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { UserSubscriptionService } from './user-subscription.service';

@Resolver(of => UserSubscription)
export class UserSubscriptionResolver {
  constructor(
    private readonly userSubscriptionService: UserSubscriptionService,
  ) {
  }

  @UseGuards(GqlAuthGuard)
  @Mutation((type) => UserSubscription)
  subscribe(
    @Args('targetUserId') targetUserId: string,
    @CurrentUser() user: User,
  ) {
    return this.userSubscriptionService.subscribe(targetUserId, user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation((type) => String)
  unsubscribe(
    @Args('targetUserId') targetUserId: string,
    @CurrentUser() user: User,
  ) {
    return this.userSubscriptionService.unsubscribe(targetUserId, user);
  }

  @ResolveField()
  subscriber(@Parent() userSubscription: UserSubscription, @Context() ctx: IGraphQLContext) {
    return ctx.userLoader.load(userSubscription.subscriberId);
  }

  @ResolveField()
  subscribedTo(@Parent() userSubscription: UserSubscription, @Context() ctx: IGraphQLContext) {
    return ctx.userLoader.load(userSubscription.subscribedToId);
  }
}
