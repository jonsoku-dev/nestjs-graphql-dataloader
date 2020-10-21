import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardResolver, CommentResolver, LikeResolver } from './board.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { AuthModule } from '../auth/auth.module';
import { User } from '../auth/entities/user.entitiy';
import { Like } from './entities/like.entity';
import { Comment } from './entities/comment.entitiy';

@Module({
  imports: [TypeOrmModule.forFeature([Board, User, Like, Comment]), AuthModule],
  providers: [BoardService, BoardResolver, CommentResolver, LikeResolver],
})
export class BoardModule {}
