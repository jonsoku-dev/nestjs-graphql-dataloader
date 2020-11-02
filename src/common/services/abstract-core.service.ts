import { FindManyOptions } from 'typeorm';

export abstract class AbstractCoreService<T> {
  public abstract async find(filter: FindManyOptions<T>): Promise<T[]>;
}
