import { UserEntity } from '../entities';

export function getUserInfo(user: UserEntity) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    deletedAd: user.deletedAt,
  };
}
