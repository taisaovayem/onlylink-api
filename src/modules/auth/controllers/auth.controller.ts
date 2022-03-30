import { Controller, Post, Body, Injectable } from '@nestjs/common';
import { RegisterRequest, UserResponse } from '../dtos';
import { UserService } from '../services';

@Injectable()
@Controller({ version: '1' })
export class AuthController {
  constructor(private userService: UserService) {}

  @Post('register')
  async register(@Body() user: RegisterRequest): Promise<UserResponse> {
    return this.userService.register(user);
  }
}
