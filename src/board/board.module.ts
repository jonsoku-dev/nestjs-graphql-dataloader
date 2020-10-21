import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardResolver } from './board.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { AuthModule } from '../auth/auth.module';
import { BoardLikeModule } from '../board-like/board-like.module';
import { BoardCommentModule } from '../board-comment/board-comment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board]),
    AuthModule,
    BoardLikeModule,
    BoardCommentModule,
  ],
  providers: [BoardService, BoardResolver],
  exports: [BoardService],
})
export class BoardModule {}
