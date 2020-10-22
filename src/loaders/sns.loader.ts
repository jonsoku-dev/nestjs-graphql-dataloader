import * as DataLoader from 'dataloader';
import { getRepository } from 'typeorm';
import { Sns } from '../auth/entities/sns.entity';

export const SnsLoader = () =>
  new DataLoader(async (keys: string[]) => {
    const results = await getRepository(Sns)
      .createQueryBuilder('sns')
      .where('sns.id IN (:...keys)', { keys })
      .getMany();
    return keys.map((key) => results.find((result) => result.userId === key));
  });
