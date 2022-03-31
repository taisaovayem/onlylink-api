import { IsNotEmpty } from 'class-validator';

export class RevokeTokenRequest {
  @IsNotEmpty()
  accessToken: string;

  @IsNotEmpty()
  refreshToken: string;
}
