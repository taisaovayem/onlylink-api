import { IsNotEmpty } from 'class-validator';

export class LikeRequest {
  @IsNotEmpty()
  post: string;
}
