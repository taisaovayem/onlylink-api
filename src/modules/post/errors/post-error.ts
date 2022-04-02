import { ApiError } from 'src/shared/errors';

export class NotPermissionViewError extends ApiError {
  constructor() {
    super({ status: 404, message: 'Đây là giáo án riêng tư' });
  }
}
