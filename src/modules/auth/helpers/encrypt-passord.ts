import { ConfigService } from '@nestjs/config';
import argon2 from 'argon2';
import bcrypt from 'bcrypt';

const configService = new ConfigService();
const saltKey = configService.get('POSTGRES_SALT');

export async function hashPassword(password: string): Promise<string> {
  const passwordHashed = await argon2.hash(password);
  return bcrypt.hash(passwordHashed, saltKey);
}

export async function comparePassword(
  password: string,
  passwordEncrypted: string,
): Promise<boolean> {
  const passwordHashed = await argon2.hash(password);
  return bcrypt.compare(passwordHashed, passwordEncrypted);
}
