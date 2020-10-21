import { Module } from '@nestjs/common';
import { BoardCommentResolver } from './board-comment.resolver';
import { BoardCommentService } from './board-comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardComment } from './entities/board-comment.entity';
import { Board } from '../board/entities/board.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BoardComment, Board])],
  providers: [BoardCommentResolver, BoardCommentService],
  exports: [BoardCommentService],
})
export class BoardCommentModule {}
