export type EmailVerificationToken = {
  id: string;
  userId: string;
  jti: string;
  tokenHash: string;
  expiresAt: Date;
  usedAt: Date | null;
  sentAt: Date;
};

