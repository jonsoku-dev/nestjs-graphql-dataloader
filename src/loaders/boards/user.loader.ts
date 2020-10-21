import * as DataLoader from 'dataloader';
import { getRepository } from 'typeorm';
import { User } from '../../auth/entities/user.entitiy';

export const UserLoader = () =>
  new DataLoader(async (keys: string[]) => {
    return await getRepository(User)
      .createQueryBuilder('user')
      .where('user.id IN (:...keys)', { keys })
      .getMany();
  });
