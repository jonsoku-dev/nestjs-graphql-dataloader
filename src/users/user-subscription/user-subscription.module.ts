import { Module } from '@nestjs/common';
import { UserSubscriptionResolver } from './user-subscription.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSubscription } from './user-subscription.entity';
import { UserSubscriptionService } from './user-subscription.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserSubscription])],
  providers: [UserSubscriptionResolver, UserSubscriptionService],
})
export class UserSubscriptionModule {
}