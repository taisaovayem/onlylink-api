import {
  Controller,
  Post,
  Body,
  Injectable,
  Headers,
  UseGuards,
  Get,
  Param,
  ParamData,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guards';
import { ListItemRequest, ListRequest } from '../dtos';
import { ListService } from '../services';

@Injectable()
@Controller({ version: '1' })
export class ListController {
  constructor(private listService: ListService) {}

  @Get('list/my-list')
  @UseGuards(AuthGuard)
  getMyList(@Headers() header: Headers, @Query() query) {
    return this.listService.getMyList(
      header['userId'],
      query['page'],
      query['perPage'],
    );
  }

  @Get('list/user/:userId')
  @UseGuards(AuthGuard)
  getListByUser(@Param() param: ParamData, @Query() query) {
    return this.listService.getListByUser(
      param['userId'],
      query['page'],
      query['perPage'],
    );
  }

  @Get('list/:listId')
  @UseGuards(AuthGuard)
  getListInfo(@Headers() header: Headers, @Param() param: ParamData) {
    return this.listService.getListInfo(header['userId'], param['listId']);
  }

  @Post('list')
  @UseGuards(AuthGuard)
  addList(@Headers() header: Headers, @Body() list: ListRequest) {
    return this.listService.addList(list, header['userId']);
  }

  @Put('list/:listId')
  @UseGuards(AuthGuard)
  editList(
    @Headers() header: Headers,
    @Body() list: ListRequest,
    @Param() param: ParamData,
  ) {
    return this.listService.editList(
      { ...list, id: param['listId'] },
      header['userId'],
    );
  }

  @Delete('list/:listId')
  @UseGuards(AuthGuard)
  deleteList(@Headers() header: Headers, @Param() param: ParamData) {
    return this.listService.deleteList(param['listId'], header['userId']);
  }

  @Post('list/add-remove-item')
  @UseGuards(AuthGuard)
  addRemoveToList(
    @Headers() header: Headers,
    @Body() { list, post }: ListItemRequest,
  ) {
    return this.listService.addRemoveToList(header['userId'], list, post);
  }

  @Get('list/:listId/posts')
  @UseGuards(AuthGuard)
  getPosts(
    @Headers() header: Headers,
    @Param() param: ParamData,
    @Query() query,
  ) {
    return this.listService.getPosts(
      header['userId'],
      param['listId'],
      query['page'],
      query['perPage'],
    );
  }
}
