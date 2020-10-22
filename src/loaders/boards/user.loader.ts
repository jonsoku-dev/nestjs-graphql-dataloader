import * as DataLoader from 'dataloader';
import { getRepository } from 'typeorm';
import { User } from '../../auth/entities/user.entitiy';

export const UserLoader = () =>
  new DataLoader(async (keys: string[]) => {
    const users = await getRepository(User)
      .createQueryBuilder('user')
      .where('user.id IN (:...keys)', { keys })
      .getMany();

    return keys.map((key) => users.find((user) => user.id === key));
  });
