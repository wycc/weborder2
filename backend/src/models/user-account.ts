export type AccountStatus = 'UNVERIFIED' | 'VERIFIED' | 'LOCKED';

export type UserAccount = {
  id: string;
  email: string;
  passwordHash: string;
  status: AccountStatus;
  createdAt: Date;
  verifiedAt: Date | null;
  lastVerificationSentAt: Date | null;
};

