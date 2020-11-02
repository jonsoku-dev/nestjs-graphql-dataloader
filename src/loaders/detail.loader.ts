import * as DataLoader from 'dataloader';
import { getRepository } from 'typeorm';
import { Detail } from '../users/auth/entities/detail.entity';

export const DetailLoader = () =>
  new DataLoader(async (keys: string[]) => {
    const results = await getRepository(Detail)
      .createQueryBuilder('detail')
      .where('detail.id IN (:...keys)', { keys })
      .getMany();
    return keys.map((key) => results.find((result) => result.userId === key));
  });
