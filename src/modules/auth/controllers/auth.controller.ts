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
  HeaderRequest,
  LoginRequest,
  RegisterRequest,
  UserResponse,
} from '../dtos';
import { AuthGuard } from '../guards';
import { UserService } from '../services';

@Injectable()
@Controller({ version: '1' })
@UseGuards(new AuthGuard())
export class AuthController {
  constructor(private userService: UserService) {}

  @Post('register')
  async register(
    @Body() user: RegisterRequest,
  ): Promise<UserResponse | ApiError> {
    return this.userService.register(user);
  }

  @Post('login')
  async login(@Body() user: LoginRequest): Promise<UserResponse | ApiError> {
    return this.userService.login(user);
  }

  @Post('revoke-token')
  async revokeToken(@Headers() { refreshToken }: HeaderRequest) {
    return this.userService.revokeToken(refreshToken);
  }

  @Post('revoke-all-token')
  async revokeAllToken(@Headers() { refreshToken }: HeaderRequest) {
    return this.userService.revokeAllToken(refreshToken);
  }
}
