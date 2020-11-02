import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notice } from './notice.entitiy';
import { Repository } from 'typeorm';
import { CreateNoticeInput } from './dtos/create-notice.dto';
import { User } from '../../users/auth/entities/user.entitiy';
import { GetNoticeListFilter } from './dtos/get-notice-list.dto';
import { UpdateNoticeInput } from './dtos/update-notice.dto';
import { UploadFileService } from '../../common/services/upload-file.service';
import { FileUpload } from 'graphql-upload';

@Injectable()
export class NoticeService extends UploadFileService<Notice> {
  constructor(
    @InjectRepository(Notice)
    private readonly noticeRepository: Repository<Notice>,
  ) {
    super(noticeRepository);
  }

  async uploadImage(targetId: string, file: FileUpload): Promise<string> {
    return super.uploadImage(targetId, file);
  }

  async createNotice(createNoticeInput: CreateNoticeInput, user: User) {
    try {
      const newNotice = await this.noticeRepository
        .createQueryBuilder('notice')
        .insert()
        .into(Notice)
        .values({
          user,
          ...createNoticeInput,
        })
        .execute();
      return await this.findById(newNotice.raw.insertId);
    } catch (e) {
      console.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  async updateNotice({ noticeId, ...other }: UpdateNoticeInput, user: User) {
    try {
      await this.noticeRepository
        .createQueryBuilder('notice')
        .update(Notice)
        .set({
          user,
          ...other,
        })
        .where('notice.id = :id', { id: noticeId })
        .execute();
      return await this.findById(noticeId);
    } catch (e) {
      console.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  async getNoticeList({ after, first, keyword }: GetNoticeListFilter) {
    try {
      let limit = 4;
      const query = this.noticeRepository.createQueryBuilder('notice').select();
      if (after) {
        query.andWhere('notice.id < :after', { after });
      }
      if (first) {
        limit = parseInt(first, 10);
      }
      if (keyword) {
        query.andWhere('notice.title LIKE :keyword', {
          keyword: `%${keyword}%`,
        });
      }

      let noticeList = await query
        .take(limit + 1)
        .orderBy('notice.id', 'DESC')
        .getMany();

      if (noticeList.length === 0) {
        return {
          edges: [],
          pageInfo: {
            hasNextPage: null,
            startCursor: null,
            endCursor: null,
          },
        };
      } else {
        const hasNextPage = noticeList.length > limit;
        noticeList = hasNextPage ? noticeList.slice(0, -1) : noticeList;
        const edges = noticeList.map((notice) => ({
          node: notice,
          cursor: notice.id,
        }));
        return {
          edges,
          pageInfo: {
            hasNextPage: hasNextPage,
            startCursor: noticeList[0].id,
            endCursor: hasNextPage
              ? noticeList[noticeList.length - 1].id
              : null,
          },
        };
      }
    } catch (e) {
      console.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  async getNotice(noticeId: string) {
    try {
      const notice = await this.findById(noticeId);
      if (!notice) throw new NotFoundException();
      return notice;
    } catch (e) {
      console.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  async deleteNotice(noticeId: string, user: User) {
    try {
      const notice = await this.findById(noticeId);
      if (!notice) throw new NotFoundException();
      if (notice.userId !== user.id)
        throw new UnauthorizedException('작성자가 아닙니다.');
      await this.noticeRepository
        .createQueryBuilder('notice')
        .delete()
        .from(Notice)
        .where('id = :id', { id: noticeId })
        .execute();
      return notice;
    } catch (e) {
      console.error(e);
      throw new HttpException(e.message, e.status);
    }
  }

  private async findById(id: string) {
    return await this.noticeRepository
      .createQueryBuilder('notice')
      .select()
      .where('id = :id', { id })
      .getOne();
  }
}
