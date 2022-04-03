import { IsNotEmpty } from 'class-validator';

export class ListItemRequest {
  @IsNotEmpty()
  list: string;

  @IsNotEmpty()
  post: string;
}
