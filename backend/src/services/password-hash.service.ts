import { hash, verify } from '@node-rs/argon2';

export const passwordHashService = {
  async hash(plain: string): Promise<string> {
    return hash(plain);
  },
  async verify(plain: string, hashed: string): Promise<boolean> {
    return verify(hashed, plain);
  },
};

