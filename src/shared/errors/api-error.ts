import { HttpException } from '@nestjs/common';

export class ApiError {
  constructor({ status, message }) {
    throw new HttpException(
      {
        status: status,
        error: message,
      },
      status,
    );
  }
}
