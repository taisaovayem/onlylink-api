import { IsOptional, IsNotEmpty } from 'class-validator';
import { POST_MODE } from '../../constants';

export class PostRequest {
  @IsOptional()
  code: string;

  @IsOptional()
  link: string;

  @IsOptional()
  description: string;

  @IsOptional()
  tags: string[];

  @IsNotEmpty()
  mode: POST_MODE;
}
