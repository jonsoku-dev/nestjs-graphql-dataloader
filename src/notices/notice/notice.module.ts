import { Module } from '@nestjs/common';
import { NoticeResolver } from './notice.resolver';
import { NoticeService } from './notice.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notice } from './notice.entitiy';

@Module({
  imports: [TypeOrmModule.forFeature([Notice])],
  providers: [NoticeResolver, NoticeService],
})
export class NoticeModule {}
