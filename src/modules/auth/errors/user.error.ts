import { ApiError } from 'src/shared/errors';

export class EmailExistError extends ApiError {
  constructor() {
    super({ status: 400, message: 'Email đã tồn tại' });
  }
}

export class EmailInvalidError extends ApiError {
  constructor() {
    super({ status: 400, message: 'Email không hợp lệ' });
  }
}

export class EmailPasswordInvalidError extends ApiError {
  constructor() {
    super({ status: 400, message: 'Email hoặc mật khẩu không đúng' });
  }
}
