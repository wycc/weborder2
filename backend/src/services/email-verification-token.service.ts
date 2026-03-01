import { createHash, randomUUID } from 'node:crypto';
import { db } from '../lib/db.js';
import { signJwt, verifyJwt } from '../lib/jwt.js';
import type { EmailVerificationToken } from '../models/email-verification-token.js';

const sha256 = (value: string): string => createHash('sha256').update(value).digest('hex');

export const emailVerificationTokenService = {
  create(userId: string, email: string): { token: string; record: EmailVerificationToken } {
    const jti = randomUUID();
    const token = signJwt({ sub: userId, email, status: 'UNVERIFIED', jti }, '15m');
    const now = new Date();
    const record: EmailVerificationToken = {
      id: randomUUID(),
      userId,
      jti,
      tokenHash: sha256(token),
      expiresAt: new Date(now.getTime() + 15 * 60 * 1000),
      usedAt: null,
      sentAt: now,
    };
    db.tokens.set(jti, record);
    return { token, record };
  },
  validate(token: string): EmailVerificationToken {
    const payload = verifyJwt(token);
    if (!payload.jti) {
      throw new Error('TOKEN_INVALID');
    }
    const record = db.tokens.get(payload.jti);
    if (!record) throw new Error('TOKEN_INVALID');
    if (record.expiresAt.getTime() < Date.now()) throw new Error('TOKEN_EXPIRED');
    if (record.usedAt) throw new Error('TOKEN_USED');
    if (record.tokenHash !== sha256(token)) throw new Error('TOKEN_INVALID');
    return record;
  },
  markUsed(jti: string): void {
    const current = db.tokens.get(jti);
    if (!current) {
      throw new Error('TOKEN_INVALID');
    }
    current.usedAt = new Date();
    db.tokens.set(jti, current);
  },
};

