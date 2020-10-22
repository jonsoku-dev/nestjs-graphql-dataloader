import { Module } from '@nestjs/common';
import { BoardLikeResolver } from './board-like.resolver';
import { BoardLikeService } from './board-like.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardLike } from './entities/board-like.entitiy';

@Module({
  imports: [TypeOrmModule.forFeature([BoardLike])],
  providers: [BoardLikeResolver, BoardLikeService],
  exports: [BoardLikeService],
})
export class BoardLikeModule {}
