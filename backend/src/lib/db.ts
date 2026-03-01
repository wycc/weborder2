import type { EmailVerificationToken } from '../models/email-verification-token.js';
import type { RegistrationAuditEvent } from '../models/registration-audit-event.js';
import type { UserAccount } from '../models/user-account.js';

export type InMemoryDb = {
  users: Map<string, UserAccount>;
  tokens: Map<string, EmailVerificationToken>;
  audits: RegistrationAuditEvent[];
};

export const db: InMemoryDb = {
  users: new Map(),
  tokens: new Map(),
  audits: [],
};

