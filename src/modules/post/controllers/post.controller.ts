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
  Header,
  Query,
} from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guards';
import { PostResponse, LinkResponse, PostRequest } from '../dtos';
import { PostService } from '../services';
import { NotPermissionViewError } from '../errors';

@Injectable()
@Controller({ version: '1' })
export class PostController {
  constructor(private postService: PostService) {}

  @Get('post/:id')
  @UseGuards(AuthGuard)
  getPost(
    @Headers() header: Headers,
    @Param() params: ParamData,
  ): Promise<PostResponse | NotPermissionViewError> {
    return this.postService.getPost(params['id'], header['userId']);
  }

  @Get('post/:id/link')
  @UseGuards(AuthGuard)
  getLink(
    @Headers() header: Headers,
    @Param() params: ParamData,
  ): Promise<LinkResponse | NotPermissionViewError> {
    return this.postService.getLink(params['id'], header['userId']);
  }

  @Get('post/my-post')
  @UseGuards(AuthGuard)
  getMyPost(@Headers() header: Headers, @Query() query) {
    return this.postService.getMyPost(
      header['userId'],
      query['page'],
      query['perPage'],
    );
  }

  @Get('post/user/:userId')
  @UseGuards(AuthGuard)
  getPostByUser(@Param() params: ParamData, @Query() query) {
    return this.postService.getPostByUser(
      params['userId'],
      query['page'],
      query['perPage'],
    );
  }

  @Get('post/tag/:tag')
  @UseGuards(AuthGuard)
  getPostByTag(@Param() params: ParamData, @Query() query) {
    return this.postService.getPostByTag(
      params['tag'],
      query['page'],
      query['perPage'],
    );
  }

  @Post('post')
  @UseGuards(AuthGuard)
  addPost(@Body() post: PostRequest, @Headers() header: Headers) {
    return this.postService.savePost(post, header['userId']);
  }
}
