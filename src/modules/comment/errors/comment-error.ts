import { ApiError } from 'src/shared/errors';

export class NoPostFoundError extends ApiError {
  constructor() {
    super({ status: 404, message: 'Giáo án không tòn tại' });
  }
}

export class CommentError extends ApiError {
  constructor() {
    super({ status: 500, message: 'Đã xảy ra lỗi khi bình luận' });
  }
}

export class NotPermissonDeleteError extends ApiError {
  constructor() {
    super({ status: 400, message: 'Bạn không có quyền xóa bình luận' });
  }
}
export class NotPermissonEditError extends ApiError {
  constructor() {
    super({ status: 400, message: 'Bạn không có quyền sửa bình luận' });
  }
}
