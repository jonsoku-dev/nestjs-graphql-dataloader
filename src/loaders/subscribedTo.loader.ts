import * as DataLoader from 'dataloader';
import { getRepository } from 'typeorm';
import { UserSubscription } from '../users/user-subscription/user-subscription.entity';

export const SubscribedToLoader = () =>
  new DataLoader(async (keys: string[]) => {
    const subscribers = await getRepository(UserSubscription)
      .createQueryBuilder()
      .where('subscribedToId IN (:...keys)', { keys })
      .getMany();

    return keys.map((key) => subscribers.filter((c) => c.subscribedToId === key));
  });
