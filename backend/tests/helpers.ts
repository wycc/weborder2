import { db } from '../src/lib/db.js';
import { emailService } from '../src/services/email.service.js';

export const resetState = (): void => {
  db.users.clear();
  db.tokens.clear();
  db.revokedJti.clear();
  db.audits.length = 0;
  emailService.resetOutbox();
};
