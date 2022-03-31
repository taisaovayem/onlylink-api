import { ApiError } from 'src/shared/errors';

export class UnauthorizedException extends ApiError {
  constructor() {
    super({ status: 401, message: 'Vui lòng đăng nhập' });
  }
}

export class InvalidSessionException extends ApiError {
  constructor() {
    super({ status: 403, message: 'Phiên đăng nhập không hợp lệ' });
  }
}

