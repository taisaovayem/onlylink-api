import { IsNotEmpty, IsOptional } from 'class-validator';

export class CommentRequest {
  @IsNotEmpty()
  post!: string;

  @IsNotEmpty()
  content!: string;

  @IsOptional()
  parent?: string;
}
