import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CacheService } from 'src/shared/cache';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, InvalidSessionException } from '../errors';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private cacheService: CacheService,
    private configService: ConfigService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization: authorizationHeader } = request.headers;
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer '))
      throw new UnauthorizedException();

    const accessToken = authorizationHeader.substring(
      7,
      authorizationHeader.length,
    );
    return this.cacheService.get(accessToken).then((userInfo) => {
      if (!userInfo) throw new InvalidSessionException();
      const { userId } = JSON.parse(userInfo as string);
      request.headers['userId'] = userId;
      return true;
    });
  }
}
