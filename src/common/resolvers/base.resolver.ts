import { Type } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { AbstractCoreService } from '../services/abstract-core.service';

export function BaseResolver<T extends Type<unknown>>(classRef: T): any {
  @Resolver({ isAbstract: true })
  abstract class BaseResolverHost {
    protected readonly _service: AbstractCoreService<T>;

    protected constructor(service: AbstractCoreService<T>) {
      this._service = service;
    }

    @Query((type) => [classRef], { name: `findAll${classRef.name}` })
    async findAll(): Promise<T[]> {
      console.log(this._service);
      return this._service.find({});
    }
  }

  return BaseResolverHost;
}
