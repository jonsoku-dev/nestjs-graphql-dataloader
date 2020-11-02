import { ConflictException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSubscription } from './user-subscription.entity';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entitiy';

@Injectable()
export class UserSubscriptionService {
  constructor(
    @InjectRepository(UserSubscription)
    private readonly subscriptionRepository: Repository<UserSubscription>,
  ) {
  }

  async subscribe(targetUserId: string, user: User) {
    try {
      if (targetUserId === String(user.id)) {
        throw new InternalServerErrorException('비정상적인 접근입니다. ');
      }
      const found = await this.subscriptionRepository.findOne({
        where: {
          subscriberId: targetUserId,
          subscribedTo: user,
        },
      });
      if (found) {
        throw new ConflictException('이미 구독하셨습니다.');
      }
      return await this.subscriptionRepository.create({
        subscriberId: targetUserId,
        subscribedTo: user,
      }).save();
    } catch (e) {
      console.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  async unsubscribe(targetUserId: string, user: User) {
    try {
      if (targetUserId === String(user.id)) {
        throw new InternalServerErrorException('비정상적인 접근입니다. ');
      }
      const found = await this.subscriptionRepository.findOne({
        where: {
          subscriberId: targetUserId,
          subscribedTo: user,
        },
      });
      if (!found) {
        throw new ConflictException('구독내역이 존재하지 않습니다.');
      }
      await this.subscriptionRepository.delete({
        subscriberId: targetUserId,
        subscribedTo: user,
      });
      return found.id;
    } catch (e) {
      console.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

}
