import {
  Body,
  Controller,
  Get,
  Injectable,
  Post,
  UseGuards,
  Headers,
  Query,
} from '@nestjs/common';
import { AuthGuard } from 'src/modules/auth/guards';
import { LikeService } from '../services';
import { LikeRequest } from '../dtos';

@Injectable()
@Controller({ version: '1' })
export class LikeController {
  constructor(private likeService: LikeService) {}

  @Post('like')
  @UseGuards(AuthGuard)
  likeUnlike(@Headers() header: Headers, @Body() { post }: LikeRequest) {
    return this.likeService.likeUnlike(post, header['userId']);
  }
}
