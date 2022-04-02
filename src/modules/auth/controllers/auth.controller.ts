import {
  Controller,
  Post,
  Body,
  Injectable,
  Headers,
  UseGuards,
  Put,
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

  @Post('auth/register')
  register(@Body() user: RegisterRequest): Promise<UserResponse | ApiError> {
    return this.userService.register(user);
  }

  @Post('auth/login')
  login(@Body() user: LoginRequest): Promise<UserResponse | ApiError> {
    return this.userService.login(user);
  }

  @Post('auth/access-token')
  getAccessToken(@Body() token: AccessTokenRequest) {
    return this.userService.getAccessToken(token.refreshToken);
  }

  @Post('auth/revoke-token')
  @UseGuards(AuthGuard)
  async revokeToken(@Body() revokeToken: RevokeTokenRequest) {
    return this.userService.revokeToken(revokeToken);
  }

  @Post('auth/revoke-all-token')
  @UseGuards(AuthGuard)
  async revokeAllToken(@Headers() header: Headers) {
    return this.userService.revokeAllToken(header['userId']);
  }

  @Post('auth/change-password')
  @UseGuards(AuthGuard)
  changePassword(@Body() user, @Headers() header: Headers) {
    return this.userService.changePassword(header['userId'], user['password']);
  }

  @Put('auth/update-info')
  @UseGuards(AuthGuard)
  updateInfo(@Body() user, @Headers() header: Headers) {
    return this.userService.updateInfo(header['userId'], user);
  }
}
