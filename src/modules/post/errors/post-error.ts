import { ApiError } from 'src/shared/errors';

export class NotPermissionViewError extends ApiError {
  constructor() {
    super({ status: 404, message: 'Đây là giáo án riêng tư' });
  }
}

export class NotPermissonDeleteError extends ApiError {
  constructor() {
    super({ status: 500, message: 'Bạn không có quyền xóa giáo án này' });
  }
}

export class DeleteError extends ApiError {
  constructor() {
    super({ status: 500, message: 'Đã xảy ra lỗi khi xóa' });
  }
}
