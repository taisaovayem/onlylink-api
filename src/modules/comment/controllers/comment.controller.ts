import {
  Body,
  Controller,
  Injectable,
  Post,
  UseGuards,
  Headers,
  Put,
  Param,
  ParamData,
  Delete,
  Get,
  Query,
} from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guards';
import { CommentService } from '../services';
import { CommentRequest } from '../dtos';

@Injectable()
@Controller({ version: '1' })
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post('comment')
  @UseGuards(AuthGuard)
  addComment(@Headers() header: Headers, @Body() comment: CommentRequest) {
    return this.commentService.addComment(comment, header['userId']);
  }

  @Put('comment/:id')
  @UseGuards(AuthGuard)
  editComment(
    @Headers() header: Headers,
    @Body() comment: CommentRequest,
    @Param() params: ParamData,
  ) {
    return this.commentService.editComment(
      params['id'],
      comment,
      header['userId'],
    );
  }

  @Delete('comment/:id')
  @UseGuards(AuthGuard)
  deleteComment(@Headers() header: Headers, @Param() params: ParamData) {
    return this.commentService.deleteComment(params['id'], header['userId']);
  }

  @Get('comment/:postId')
  @UseGuards(AuthGuard)
  getComments(@Param() params: ParamData, @Query() query) {
    return this.commentService.getComments(
      params['postId'],
      query['page'],
      query['perPage'],
    );
  }
}
