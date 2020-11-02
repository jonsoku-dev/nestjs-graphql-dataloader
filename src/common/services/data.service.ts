import { Type } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as DataLoader from 'dataloader';
import { keyBy } from 'lodash';
import { Repository } from 'typeorm';

export interface IDataService<T> {
  readonly repository: Repository<T>;
  load: (id: string | number) => Promise<T>;
  loadMany: (ids: Array<string | number>) => Promise<T[]>;
}

type Constructor<I> = new (...args: any[]) => I; // Main Point

export function DataService<T>(entity: Constructor<T>): Type<IDataService<T>> {
  class DataServiceHost implements IDataService<T> {
    @InjectRepository(entity) public readonly repository: Repository<T>;

    private get primaryColumnName(): string {
      return this.repository.metadata.primaryColumns[0]?.propertyName;
    }

    private loader: DataLoader<number | string, T> = new DataLoader(
      async (ids) => {
        const entities = await this.repository.findByIds(ids as any[]);
        const entitiesKeyed = keyBy(entities, this.primaryColumnName);
        return ids.map((id) => entitiesKeyed[id]);
      },
    );

    public async load(id: string | number): Promise<T> {
      return this.loader.load(id);
    }

    public async loadMany(ids: Array<string | number>): Promise<T[]> {
      return this.loadMany(ids);
    }
  }

  return DataServiceHost;
}
