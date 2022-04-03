import { IsOptional, IsNotEmpty } from 'class-validator';
import { LIST_MODE } from '../../constants';

export class ListRequest {
  @IsOptional()
  id?: string;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  description: string;

  @IsNotEmpty()
  mode: LIST_MODE;
}
