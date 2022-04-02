import { ApiError } from 'src/shared/errors';

export class InvalidInformationError extends ApiError {
  constructor() {
    super({ status: 500, message: 'Thông tin không hợp lệ' });
  }
}

export class LikeError extends ApiError {
  constructor() {
    super({ status: 500, message: 'Đã xảy ra lỗi khi yêu thích giáo án' });
  }
}
