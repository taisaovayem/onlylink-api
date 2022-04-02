import { UserEntity } from 'src/modules/auth/entities';
import { POST_MODE } from '../../constants';
import { TagEntity } from '../../entities';

export class PostResponse {
  id: string;
  code?: string;
  link?: string;
  description?: string;
  tag?: TagEntity[];
  author: UserEntity;
  mode: POST_MODE;
  view: number;
  like: number;
}

export class LinkResponse {
  link: string;
}
