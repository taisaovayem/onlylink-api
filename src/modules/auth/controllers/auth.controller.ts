import {
  Controller,
  Post,
  Body,
  Injectable,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { ApiError } from 'src/shared/errors';
import {
  LoginRequest,
  RegisterRequest,
  UserResponse,
  RevokeTokenRequest,
  AccessTokenRequest,
} from '../dtos';
import { AuthGuard } from '../guards';
import { UserService } from '../services';

@Injectable()
@Controller({ version: '1' })
export class AuthController {
  constructor(private userService: UserService) {}

  @Post('register')
  register(@Body() user: RegisterRequest): Promise<UserResponse | ApiError> {
    return this.userService.register(user);
  }

  @Post('login')
  login(@Body() user: LoginRequest): Promise<UserResponse | ApiError> {
    return this.userService.login(user);
  }

  @Post('access-token')
  getAccessToken(@Body() token: AccessTokenRequest) {
    return this.userService.getAccessToken(token.refreshToken);
  }

  @Post('revoke-token')
  @UseGuards(AuthGuard)
  async revokeToken(@Body() revokeToken: RevokeTokenRequest) {
    return this.userService.revokeToken(revokeToken);
  }

  @Post('revoke-all-token')
  @UseGuards(AuthGuard)
  async revokeAllToken(@Headers() header: Headers) {
    return this.userService.revokeAllToken(header['userId']);
  }
}
