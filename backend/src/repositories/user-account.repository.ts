import { randomUUID } from 'node:crypto';
import { db } from '../lib/db.js';
import type { UserAccount } from '../models/user-account.js';

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

export const userAccountRepository = {
  async findById(id: string): Promise<UserAccount | null> {
    return db.users.get(id) ?? null;
  },
  async findByEmailInsensitive(email: string): Promise<UserAccount | null> {
    const normalized = normalizeEmail(email);
    for (const user of db.users.values()) {
      if (normalizeEmail(user.email) === normalized) {
        return user;
      }
    }
    return null;
  },
  async create(email: string, passwordHash: string): Promise<UserAccount> {
    const exists = await this.findByEmailInsensitive(email);
    if (exists) {
      throw new Error('EMAIL_EXISTS');
    }
    const user: UserAccount = {
      id: randomUUID(),
      email: normalizeEmail(email),
      passwordHash,
      status: 'UNVERIFIED',
      createdAt: new Date(),
      verifiedAt: null,
      lastVerificationSentAt: null,
    };
    db.users.set(user.id, user);
    return user;
  },
  async save(user: UserAccount): Promise<UserAccount> {
    db.users.set(user.id, user);
    return user;
  },
};

