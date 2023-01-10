import { ApiError } from 'src/shared/errors';

export class NotPermissonViewListError extends ApiError {
  constructor() {
    super({ status: 400, message: 'Bạn không có quyền xem danh sách' });
  }
}

export class NotPermissonEditListError extends ApiError {
  constructor() {
    super({ status: 400, message: 'Bạn không có quyền sửa danh sách' });
  }
}

export class NotPermissonDeleteListError extends ApiError {
  constructor() {
    super({ status: 400, message: 'Bạn không có quyền xóa danh sách' });
  }
}

export class DeleteListError extends ApiError {
  constructor() {
    super({ status: 400, message: 'Bạn không có quyền xóa danh sách' });
  }
}

export class NotPermissonAddToListError extends ApiError {
  constructor() {
    super({ status: 400, message: 'Bạn không có quyền' });
  }
}

export class AddToListError extends ApiError {
  constructor() {
    super({ status: 400, message: 'Đã xảy ra lỗi khi thêm vào danh sách' });
  }
}

export class RemoveFromListError extends ApiError {
  constructor() {
    super({ status: 400, message: 'Đã xảy ra lỗi khi xóa khỏi danh sách' });
  }
}

export class NotFoundError extends ApiError {
  constructor() {
    super({ status: 404, message: 'Không tìm thấy danh sách' });
  }
}

export class NotFoundPostError extends ApiError {
  constructor() {
    super({ status: 404, message: 'Không tìm thấy giáo án' });
  }
}
