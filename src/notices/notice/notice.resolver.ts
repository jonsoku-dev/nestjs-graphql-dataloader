import {
  Args,
  Context,
  Mutation,
  Query,
  ResolveProperty,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { Notice } from './notice.entitiy';
import { CreateNoticeInput } from './dtos/create-notice.dto';
import { User } from '../../auth/entities/user.entitiy';
import { NoticeService } from './notice.service';
import { AdminUser } from '../../auth/admin-user.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/gql-auth.guard';
import { IGraphQLContext } from '../../types/graphql.types';
import {
  GetNoticeListFilter,
  GetNoticeListOutput,
} from './dtos/get-notice-list.dto';
import { UpdateNoticeInput } from './dtos/update-notice.dto';

@Resolver(() => Notice)
export class NoticeResolver {
  constructor(private readonly noticeService: NoticeService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation((type) => Notice)
  createNotice(
    @Args('input') createNoticeInput: CreateNoticeInput,
    @AdminUser() user: User,
  ) {
    return this.noticeService.createNotice(createNoticeInput, user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation((type) => Notice)
  updateNotice(
    @Args('input') updateNoticeInput: UpdateNoticeInput,
    @AdminUser() user: User,
  ) {
    return this.noticeService.updateNotice(updateNoticeInput, user);
  }

  @Query((type) => GetNoticeListOutput)
  getNoticeList(
    @Args('filter', { nullable: true })
    getNoticeListFilter: GetNoticeListFilter,
  ) {
    return this.noticeService.getNoticeList(getNoticeListFilter);
  }

  @Query((type) => Notice)
  getNotice(@Args('noticeId') noticeId: string) {
    return this.noticeService.getNotice(noticeId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation((type) => Notice)
  deleteNotice(@Args('noticeId') noticeId: string, @AdminUser() user: User) {
    return this.noticeService.deleteNotice(noticeId, user);
  }

  @ResolveProperty('user')
  async user(@Root() notice: Notice, @Context() ctx: IGraphQLContext) {
    return await ctx.userLoader.load(notice.userId);
  }
}
