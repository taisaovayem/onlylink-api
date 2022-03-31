import { IsNotEmpty } from 'class-validator';

export class AccessTokenRequest {
  @IsNotEmpty()
  refreshToken: string;
}
